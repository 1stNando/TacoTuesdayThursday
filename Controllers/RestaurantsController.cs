using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Geocoding.Microsoft;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TacoTuesdayThursday.Models;

namespace TacoTuesdayThursday.Controllers
{

    // All of these routes will be at the base URL:     /api/Restaurants
    // That is what "api/[controller]" means below. It uses the name of the controller
    // in this case RestaurantsController to determine the URL
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantsController : ControllerBase
    {
        // This is the variable you use to have access to your database
        private readonly DatabaseContext _context;

        // Adding MAPS features
        private readonly string BING_MAPS_KEY;

        // Constructor that receives a reference to your database context
        // and stores it in _context for you to use in your API methods
        // ANOTHER EXAMPLE OF DEPENDENCY INJECTION!!! look at context. Something else is managing it and handing it to us. Iconfig also is one we added it later to use bing maps key. 
        public RestaurantsController(DatabaseContext context, IConfiguration config)
        {
            _context = context;

            //BING_MAPS
            BING_MAPS_KEY = config["BING_MAPS_KEY"];
        }

        // GET: api/Restaurants
        // Return a list of all your Restaurants. Restaurant API should return their associated reviews.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Restaurant>>> GetRestaurants(string filter)
        {
            // Uses the database context in `_context` to request all of the Restaurants, 
            // sort them by row id and return them as a JSON array.
            if (filter == null)
            {
                return await _context.Restaurants.
                    OrderBy(restaurant => restaurant.Id).
                    Include(restaurant => restaurant.Reviews).
                    ToListAsync();
            }
            else
            {
                return await _context.Restaurants.
                    OrderBy(restaurant => restaurant.Id).
                    Where(restaurant => restaurant.Name.Contains(filter)).
                    Include(restaurant => restaurant.Reviews).
                    ToListAsync();
            }
        }

        // GET: api/Restaurants/5
        //
        // Fetches by "id"
        [HttpGet("{id}")]
        public async Task<ActionResult<Restaurant>> GetRestaurant(int id)
        {


            // Find the restaurant in the database using Include to ensure we have the associated reviews

            var restaurant = await _context.Restaurants.
                Where(restaurant => restaurant.Id == id).
                Include(restaurant => restaurant.Reviews).
                ThenInclude(review => review.User).
                FirstOrDefaultAsync();

            // If we didn't find anything, we receive a `null` in return
            if (restaurant == null)
            {
                // Return a `404` to the client if we could not find a restaurant with this id. 
                return NotFound();
            }

            // Return the restaurant as a JSON object
            return restaurant;
        }

        // PUT: api/Restaurants/5
        //
        // Update an individual restaurant with the requested id. The id is specified in the URL
        // In the sample URL above it is the `5`. The "{id} in the [HttpPut("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        // In addition the `body` of the request is parsed and then made available to us as a Restaurant
        // variable named restaurant. The controller matches the keys of the JSON object the client
        // supplies to the names of the attributes of our Restaurant POCO class. This represents the
        // new values for the record.
        //
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRestaurant(int id, Restaurant restaurant)
        {
            // If the ID in the URL does not match the ID in the supplied request body, return a bad request
            if (id != restaurant.Id)
            {
                return BadRequest();
            }

            // Tell the database to consider everything in restaurant to be _updated_ values. When
            // the save happens the database will _replace_ the values in the database with the ones from restaurant
            _context.Entry(restaurant).State = EntityState.Modified;

            try
            {
                // Try to save these changes.
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Ooops, looks like there was an error, so check to see if the record we were
                // updating no longer exists.
                if (!RestaurantExists(id))
                {
                    // If the record we tried to update was already deleted by someone else,
                    // return a `404` not found
                    return NotFound();
                }
                else
                {
                    // Otherwise throw the error back, which will cause the request to fail
                    // and generate an error to the client.
                    throw;
                }
            }

            // Return a copy of the updated data
            return Ok(restaurant);
        }

        // POST: api/Restaurants
        //
        // Creates a new instance of a restaurant in th database.
        // The `body` of the request is parsed and then made available to us as a Restaurant
        // variable named restaurant. The controller matches the keys of the JSON object the client
        // supplies to the names of the attributes of our Restaurant POCO class. This represents the
        // new values for the record.
        //
        [HttpPost]
        // Adds authentication requirement to this endpoint
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

        public async Task<ActionResult<Restaurant>> PostRestaurant(Restaurant restaurant)
        {
            // Set the UserID to the current user id, this overrides anything the user specifies. 
            restaurant.UserId = GetCurrentUserId();

            //////////BING MAPS/geocoding/////////
            // Create a new geocoder!
            var geocoder = new BingMapsGeocoder(BING_MAPS_KEY);

            // Request this address to be geocoded.
            var geocodedAddresses = await geocoder.GeocodeAsync(restaurant.Address);

            // ... and pick out the best address sorted by the confidence level
            var bestGeocodedAddress = geocodedAddresses.OrderBy(address => address.Confidence).FirstOrDefault();

            // If we have a best geocoded address, use the latitude and longitude from that result
            if (bestGeocodedAddress != null)
            {
                restaurant.Latitude = bestGeocodedAddress.Coordinates.Latitude;
                restaurant.Longitude = bestGeocodedAddress.Coordinates.Longitude;
            }
            //////////////////////////////////////Geocoding end///



            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            // Return a response that indicates the object was created (status code `201`) and some additional
            // headers with details of the newly created object.
            return CreatedAtAction("GetRestaurant", new { id = restaurant.Id }, restaurant);
        }

        [HttpDelete("{id}")]
        // Adds authentication requirement to this endpoint
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

        public async Task<IActionResult> DeleteRestaurant(int id)
        {
            // Find this restaurant by looking for the specific id
            // var restaurant = await _context.Restaurants.FindAsync(id);

            // Use this instead to give the user a 404
            var restaurant = await _context.Restaurants.Where(restaurant => restaurant.UserId == GetCurrentUserId()).FirstOrDefaultAsync();

            if (restaurant == null)
            {
                // If id not found, return `404` not found
                return NotFound();
            }

            // Add authentication method to ensure authentic user only can delete.
            // If the current user ( which we trust the ID since it comes from the JWT) is exactly the same ID recorded in the restaurant, then allow this. Otherwise, if they don't match, tell the user "Unauthorized" and do not proceed. 
            if (restaurant.UserId != GetCurrentUserId())
            {
                // Make a custom error response
                var response = new
                {
                    status = 401,
                    errors = new List<string>() { "Not Authorized" }
                };
            }

            // Tell the database we want to remove this record.
            _context.Restaurants.Remove(restaurant);

            // Tell the database to perform the deletion
            await _context.SaveChangesAsync();

            return Ok(restaurant);
        }

        // Private helper method that looks up an existing restaurant by the supplied id
        private bool RestaurantExists(int id)
        {
            return _context.Restaurants.Any(restaurant => restaurant.Id == id);
        }

        // Storing the related user Id
        // Set a private helper method to get the JWT claim related to the user ID
        private int GetCurrentUserId()
        {
            // Get the User ID from the claim and then parse it as an integer
            return int.Parse(User.Claims.FirstOrDefault(claim => claim.Type == "Id").Value);
        }
    }
}