using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TacoTuesday.Models;
using TacoTuesdayThursday.Models;

namespace TacoTuesdayThursday.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public UsersController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {// This try/catch deals with potential email duplicate in Users. 
            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUser", new { id = user.Id }, user);
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException)
            {
                // Make a custom error response
                var response = new
                {
                    status = 400,
                    errors = new List<string>() { "This account email already exists!" }
                };

                // Return our error with the custom response
                return BadRequest(response);
            }

        }
    }
}