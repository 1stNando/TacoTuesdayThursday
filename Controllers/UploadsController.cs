using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace TacoTuesdayThursday.Controllers
{
    // All of these routes will be at the base URL:     /api/Uploads
    // That is what "api/[controller]" means below. It uses the name of the controller
    // in this case RestaurantsController to determine the URL
    [Route("api/[controller]")]
    [ApiController]
    public class UploadsController : ControllerBase
    {
        // Obtained by creating an account on Cloudinary services. 
        private readonly string CLOUDINARY_CLOUD_NAME;
        private readonly string CLOUDINARY_API_KEY;
        private readonly string CLOUDINARY_API_SECRET;



        public UploadsController(IConfiguration config)
        {
            CLOUDINARY_CLOUD_NAME = config["CLOUDINARY_CLOUD_NAME"];
            CLOUDINARY_API_KEY = config["CLOUDINARY_API_KEY"];
            CLOUDINARY_API_SECRET = config["CLOUDINARY_API_SECRET"];
        }

        //Next, we will ensure that we limit our uploads to supported image types.
        // To do so, we'll make a class property to hold a set of strings of the content types allowed. We will use the HashSet collection type since it is efficient for fast lookups and does not allow for duplicates (unlike a List)

        private readonly HashSet<string> VALID_CONTENT_TYPE = new HashSet<string> {
            "image/jpg",
            "image/jpeg",
            "image/pjpeg",
            "image/gif",
            "image/x-png",
            "image/png",
        };

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [RequestSizeLimit(10_000_000)]
        //We will now update the controller definition to accept an upload, process it, send it to Cloudinary, and return the Cloudinary URL of the newly uploaded file. IFormFile.
        public async Task<ActionResult> Upload(IFormFile file)
        {
            // Check this content type against a set of allowed content types from HashSet above.
            var contentType = file.ContentType.ToLower();
            if (!VALID_CONTENT_TYPE.Contains(contentType))
            {
                return BadRequest("Not Valid Image Type");
            }

            // Send the content to Cloudinary.
            // Create and configure a client object to be able to upload to Cloudinary
            var cloudinaryClient = new Cloudinary(new Account(CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET));

            // Create an object describing the upload we are going to process.
            // We will provide the file name and the stream of the content itself.
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, file.OpenReadStream())
            };

            // Upload the file to the server
            ImageUploadResult result = await cloudinaryClient.UploadLargeAsync(uploadParams);

            // If the status code is an "OK" then the upload was accepted so we will return
            // the URL to the client
            if (result.StatusCode == HttpStatusCode.OK)
            {
                var urlOfUploadedFile = result.SecureUrl.AbsoluteUri;

                return Ok(new { url = urlOfUploadedFile });
            }
            else
            {
                // Otherwise there was some failure in uploading
                return BadRequest("Upload failed");
            }


        }
    }
}