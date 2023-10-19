namespace TacoTuesdayThursday.Models
{
    // Using EntityFramework Core, generate a model class to be used with our RestaurantsController.
    public class Restaurant
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string Telephone { get; set; }
    }
}