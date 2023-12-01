using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TacoTuesdayThursday.Models;
using TacoTuesdayThursday.Utils;

namespace TacoTuesdayThursday.Controllers
{
    public class LoginUser
    {
        // Represents the VIEW Model
        // Exists outside the database and in this case only used by this controller. The purpose is to have an object that cansee the email and the password for the session we are creating. 
        public string Email { get; set; }
        public string Password { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    // Look in folder Utils to learn more about the SDG created TokenGenerator.cs to generate tokens.
    {
        // This is the variable you use to have access to your database.
        private readonly DatabaseContext _context;

        readonly protected string JWT_KEY;

        // Constructor that receives a reference to your database context
        // and store it in _context for you to use in your API methods
        // NOTE: THIS IS AN EXAMPLE OF "DEPENDENCY INJECTION". VIDEO 2, minute 30.
        public SessionsController(DatabaseContext context, IConfiguration config)
        {
            _context = context;
            JWT_KEY = config["JWT_KEY"];
        }

        // POST action (CREATE SESSION => Logging In)
        [HttpPost]
        public async Task<ActionResult> Login(LoginUser loginUser)
        {
            var foundUser = await _context.Users.FirstOrDefaultAsync(user => user.Email == loginUser.Email);

            if (foundUser != null && foundUser.IsValidPassword(loginUser.Password))
            {
                // create a custom response
                var response = new
                {
                    // This is the login token
                    token = new TokenGenerator(JWT_KEY).TokenFor(foundUser),

                    // The is the user details
                    user = foundUser
                };

                return Ok(response);
            }
            else
            {
                // Make a custom error response
                var response = new
                {
                    status = 400,
                    errors = new List<string>() { foundUser == null ? "User does not exist" : "Wrong password" }
                };

                // Return our error with the custom response
                return BadRequest(response);
            }
        }
    }
}