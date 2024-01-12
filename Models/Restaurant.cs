using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TacoTuesday.Models;

namespace TacoTuesdayThursday.Models
{
        // Using EntityFramework Core, generate a model class to be used with our RestaurantsController.
        public class Restaurant
        {
                public int Id { get; set; }

                [Required(ErrorMessage = "You must provide a name.")]
                public string Name { get; set; }

                public string Description { get; set; }

                [Required(ErrorMessage = "You must provide an address.")]
                public string Address { get; set; }

                public string Telephone { get; set; }

                public List<Review> Reviews { get; set; }

                // Storing the User that Created Restaurants and Reviews. Handbook.
                // Adds the database column for the associated user
                public int UserId { get; set; }

                // The actual associated object
                public User User { get; set; }

                // MAPS through Geocoding location
                // public double Latitude { get; set; }
                // public double Longitude { get; set; }
        }
}