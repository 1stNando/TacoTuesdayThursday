using System.ComponentModel.DataAnnotations;

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
    }
}