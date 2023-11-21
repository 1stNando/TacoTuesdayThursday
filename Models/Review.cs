using System;
using TacoTuesdayThursday.Models;

namespace TacoTuesday.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Summary { get; set; }
        public string Body { get; set; }
        public int Stars { get; set; }
        public DateTime CreatedAt { get; private set; } = DateTime.Now;

        // This tells the DB that Review "belongs to" one restaurant! 
        public int RestaurantId { get; set; }
        // This returns in your migrations AddReviews with a CreateIndex column for a "RestaurantId" to keep track of where the review is associated to. 
        public Restaurant Restaurant { get; set; }
    }
}