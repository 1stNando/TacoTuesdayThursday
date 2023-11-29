using System;
using System.Reflection;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Logging;
using TacoTuesday.Models;

namespace TacoTuesdayThursday.Models
{
    public partial class DatabaseContext : DbContext
    {

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyUtcDateTimeConverter();//Put before seed data and after model creation
        }
        // Change this if you want to have a different database name in development
        private static string DEVELOPMENT_DATABASE_NAME = "TacoTuesdayThursdayDatabase";

        // Change this to true if you want to have logging of SQL statements in development
        private static bool LOG_SQL_STATEMENTS_IN_DEVELOPMENT = false;

        // Add database tables here!!!!
        public DbSet<Restaurant> Restaurants { get; set; }
        // Tell the context about the Review collection/table
        public DbSet<Review> Reviews { get; set; }

        // table for Users. Tells the context about User collection/table. 
        public DbSet<User> Users { get; set; }

        // Video: Creating Users Part - 2 start. 
        // Add a UNIQUE INDEX field. This will prevent duplicate email to exist in the database of Users(unique).  
        //(UPDATE: this did not work with new versions. Instead we added this to the Users.cs model as [Index(nameof(Email), IsUnique = true)])
        // protected override void OnModelCreating(ModelBuilder modelBuilder)
        // {
        //     modelBuilder.Entity<User>().HasIndex(user => user.Email).IsUnique();
        // }

        // Rarely do we have to touch this
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (LOG_SQL_STATEMENTS_IN_DEVELOPMENT && Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                var loggerFactory = LoggerFactory.Create(builder => builder.AddConsole());
                optionsBuilder.UseLoggerFactory(loggerFactory);
            }

            if (!optionsBuilder.IsConfigured)
            {
                var databaseURL = Environment.GetEnvironmentVariable("DATABASE_URL");
                var defaultConnectionString = $"server=localhost;database={DEVELOPMENT_DATABASE_NAME}";

                var conn = databaseURL != null ? ConvertPostConnectionToConnectionString(databaseURL) : defaultConnectionString;

                optionsBuilder.UseNpgsql(conn);
            }
        }

        private string ConvertPostConnectionToConnectionString(string connection)
        {
            var _connection = connection.Replace("postgres://", String.Empty);

            var connectionParts = Regex.Split(_connection, ":|@|/");

            return $"server={connectionParts[2]};SSL Mode=Require;Trust Server Certificate=true;database={connectionParts[4]};User Id={connectionParts[0]};password={connectionParts[1]};port={connectionParts[3]}";
        }
    }


    public static class UtcDateAnnotation
    {
        private const string IsUtcAnnotation = "IsUtc";
        private static readonly ValueConverter<DateTime, DateTime> UtcConverter = new ValueConverter<DateTime, DateTime>(convertTo => DateTime.SpecifyKind(convertTo, DateTimeKind.Utc), convertFrom => convertFrom);

        public static PropertyBuilder<TProperty> IsUtc<TProperty>(this PropertyBuilder<TProperty> builder, bool isUtc = true) => builder.HasAnnotation(IsUtcAnnotation, isUtc);

        public static bool IsUtc(this IMutableProperty property)
        {
            if (property != null && property.PropertyInfo != null)
            {
                var attribute = property.PropertyInfo.GetCustomAttribute<IsUtcAttribute>();
                if (attribute is not null && attribute.IsUtc)
                {
                    return true;
                }

                return ((bool?)property.FindAnnotation(IsUtcAnnotation)?.Value) ?? true;
            }
            return true;
        }

        /// <summary>
        /// Make sure this is called after configuring all your entities.
        /// </summary>
        public static void ApplyUtcDateTimeConverter(this ModelBuilder builder)
        {
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (!property.IsUtc())
                    {
                        continue;
                    }

                    if (property.ClrType == typeof(DateTime) ||
                        property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(UtcConverter);
                    }
                }
            }
        }
    }
    public class IsUtcAttribute : Attribute
    {
        public IsUtcAttribute(bool isUtc = true) => this.IsUtc = isUtc;
        public bool IsUtc { get; }
    }
}