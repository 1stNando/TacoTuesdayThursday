using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TacoTuesday.Models;
using TacoTuesdayThursday.Models;





namespace TacoTuesdayThursday.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ReviewsController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await _context.Reviews.OrderBy(row => row.Id).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);

            if (review == null)
            {
                return NotFound();
            }

            // Return the review as a JSON object. 
            return review;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(int id, Review review)
        {
            if (id != review.Id)
            {
                return BadRequest();
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReviewExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(review);
        }

        [HttpPost]
        // Adds authentication requirement to this endpoint
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Review>> PostReview(Review review)
        {
            // Set the UserId to the current user id, this overrides anything the user specifies.
            review.UserId = GetCurrentUserId();

            // Indicate to the database context we want to add this new record
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Return a response that indicates the object was created (status code `201`) and some additional
            // headers with details of the newly created object.
            return CreatedAtAction("GetReview", new { id = review.Id }, review);
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.Claims.FirstOrDefault(claim => claim.Type == "Id").Value);
        }

        // DELETE: api/Reviews/5
        //
        // Deletes an individual review with the requested id. The id is specified in the URL
        // In the sample URL above it is the `5`. The "{id} in the [HttpDelete("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            // Find this review by looking for the specific id
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                // There wasn't a review with that id so return a `404` not found
                return NotFound();
            }

            // Tell the database we want to remove this record
            _context.Reviews.Remove(review);

            // Tell the database to perform the deletion
            await _context.SaveChangesAsync();

            // Returns a copy of the deleted data
            return Ok(review);
        }

        // Private helper method that looks up an existing review by the supplied id
        private bool ReviewExists(int id)
        {
            return _context.Reviews.Any(review => review.Id == id);
        }
    }
}