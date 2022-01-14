/**
 * "StAuth10222: I James Gelfand, 000275852 certify that this material is my original work. 
 * No other person's work has been used without due acknowledgement. 
 * I have not made my work available to anyone else."
 */

// A Discord bot that accepts commands with a specific format

const { Client, Intents } = require('discord.js')
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
});

// Yelp requirements
let yelpAPI = require('yelp-api');
 
// Create a new yelpAPI object with *your* API key
// REQUIRES API KEY
let apiKey = 'APIKEYHERE';
let yelp = new yelpAPI(apiKey);
 
// Set any parameters, if applicable (see API documentation for allowed params)
// let params = [{ phone: '+14159083801' }];

let greeting = "Hello! With this bot you can search for info about restaurants and events using the following commands.\n"
greeting += "Please note! When entering a location it is better to be more specific, Hamilton ON vs just Hamilton. Commands and parameters are separated by commas.\n"
greeting += "Test Command - Search by Phone\nSample command = phone,19055260792\n";
greeting += "Command 1 - Search by city\nSample command = city,Toronto\n"
greeting += "Command 2 - Open now in city\nSample command = open,Toronto\n"
greeting += "Command 3 - Search for delivery, optional category\nSample command = delivery,Toronto,Chinese\n"
greeting += "Command 4 - Browse by category\nSample command = category,Ottawa,bar\n"
greeting += "Command 5 - Browse by price and optional category\nSample command = category,Toronto,4,sushi\n"
greeting += "Command 6 - Return reviews for a business by phone number\nSample command = reviews,19055260792\n"
greeting += "Command 7 - Search for events\nSample command = event,London\n"


/**
 * On load, Discord bot will send a message of applicable commands.
 */
client.on('ready', () => {
  client.channels.fetch('897583960723447821')
  .then(channel => {
      channel.send(greeting);
  })
});

function printBusinesses(result) {
  let outputText = "";
  for (i in result.businesses) {
    if (result.businesses[i] !== "undefined" && result.length != 0) {
        // Business Name
        businessName = result.businesses[i].name;
        if (businessName !== "undefined" && businessName.length > 0 && businessName !== null) {
          outputText += "Business Name: " + businessName + "\n";
        } else {
          outputText += "Business Name: N/A\n";
        }          
        // Address
        address = result.businesses[i].location.address1;
        if (address !== "undefined" && address.length > 0 && address !== null) {
          outputText += "Address: " + address + "\n";
        } else {
          outputText += "Address: N/A\n";
        }
        // Phone
        phone = result.businesses[i].phone;
        if (phone !== "undefined" && phone.length > 0 && phone !== null) {
          outputText += "Phone: " + phone + "\n";
        } else {
          outputText += "Phone: N/A\n";
        }
        // Business Rating
        rating = result.businesses[i].rating;
        if (rating !== "undefined" && rating !== null) {
          outputText += "Rating: " + rating + "\n";
        } else {
          outputText += "Rating: N/A\n";
        }      
        // Business URL
        url = result.businesses[i].url;
        if (url !== "undefined" && url !== null) {
          outputText += "Website: " + url + "\n";
        } else {
          outputText += "Website: N/A\n";
        }
    } else {
      outputText = "An error was encountered."; 
    }
  }
  return outputText;
}

// the 'messageCreate' event will occur when a message is entered into a channel
client.on('messageCreate', async message => {
  
  // only have the bot consider messages that are not sent from a bot (such as
  // itself)
  if (!message.author.bot) 
  {
    // split the message into multiple strings based on spaces, see the console 
    // for the array of strings we can expect to see stored in command
    command = message.content.split(",");
    console.log(command);

    /**
     * TEST COMMAND
     * Search for a business by phone number
     */
    if (command[0] == "phone")
    {
      op1 = parseFloat(command[1]);
      let params = [{ phone: op1 }];
      let outputText = "";
      yelp.query('businesses/search/phone', params).then(data => {
        // Success 
        result = JSON.parse(data); 
        if (result !== "undefined") {
          outputText = printBusinesses(result);
        } else {
          message.reply("An error was encountered."); 
        }
        // Check that your query returns an entry
        if (outputText.length > 0) {
          message.reply(outputText); 
        }
        else {
          message.reply("Query did not return a value."); 
        }
      })
      .catch(err => {
        // Failure
        console.log(err);
      }); 
    }

    /**
     * COMMAND 1 - Search by City/Location
     * Returns 5 restaurants within a specified city.
     * Due to constaints of Discord, limit is capped at 5
     */
    else if (command[0] == "location" || command[0] == "city")
    {
      // The city being queried
      op1 = (command[1]);
      let params = [{ location: op1, limit: 5 }];
      let outputText = "";
      yelp.query('businesses/search', params).then(data => {
        // Success
        result = JSON.parse(data); 
        if (result !== "undefined") {
          outputText = printBusinesses(result);
        } else {
          message.reply("An error was encountered."); 
        }
        // Check that your query returns an entry
        if (outputText.length > 0) {
          message.reply(outputText); 
        }
        else {
          message.reply("Query did not return a value."); 
        }
      })
      .catch(err => {
        // Failure
        console.log(err);
      }); 
    }

    /**
     * COMMAND 2 - Search for only open restaurants in a specific city. 
     */
    else if (command[0] == "open")
    {
      // The city being queried
      op1 = (command[1]);
      let params = [{ location: op1, open_now: "true", limit: 5 }];
      let outputText = "";
      yelp.query('businesses/search', params).then(data => {
        // Success
        result = JSON.parse(data); 
        if (result !== "undefined") {
          outputText = printBusinesses(result);
        } else {
          message.reply("An error was encountered."); 
        }
        // Check that your query returns an entry
        if (outputText.length > 0) {
          message.reply(outputText); 
        }
        else {
          message.reply("Query did not return a value."); 
        }
      })
      .catch(err => {
        // Failure
        console.log(err);
      }); 
    }

    /**
     * COMMAND 3 - Looks for restaurants that do delivery, can also add a category.
     */
    else if (command[0] == "delivery")
    {
        op1 = (command[1]);
        let params = [{ location: op1, limit: 5 }];
      if (command.length === 3) {
        op1 = (command[1]);
        op2 = (command[2]);
        params = [{ location: op1, categories: op2, limit: 5 }];
      }
      let outputText = "";
      yelp.query('businesses/search', params).then(data => {
        // Success
        result = JSON.parse(data); 
        if (result !== "undefined") {
          outputText = printBusinesses(result);
        } else {
          message.reply("An error was encountered."); 
        }
        // Check that your query returns an entry
        if (outputText.length > 0) {
          message.reply(outputText); 
        }
        else {
          message.reply("Query did not return a value."); 
        }
      })
      .catch(err => {
        // Failure
        console.log(err);
      }); 
    }

    /**
     * COMMAND 4 - Browse by category
     * Enter in a city and the category you are browsing for.
     */
    else if (command[0] == "category")
    {
      // The city being queried
      op1 = (command[1]);
      // Category queried
      op2 = (command[2]);
      let params = [{ location: op1, categories: op2, limit: 5 }];
      let outputText = "";
      yelp.query('businesses/search', params).then(data => {
        // Success
        result = JSON.parse(data); 
        if (result !== "undefined") {
          outputText = printBusinesses(result);
        } else {
          message.reply("An error was encountered."); 
        }
        // Check that your query returns an entry
        if (outputText.length > 0) {
          message.reply(outputText); 
        }
        else {
          message.reply("Query did not return a value."); 
        }
      })
      .catch(err => {
        // Failure
        console.log(err);
      }); 
    }

    /**
     * COMMAND 5 - Browse by Price and optional category
     * Look up the city, price and category of business.
     */
    else if (command[0] == "price")
    {
      // The city being queried
      op1 = (command[1]);
      op2 = (command[2]);
      let params = [{ location: op1, price: op2, limit: 5 }];
      if (command.length === 4) {
        op1 = (command[1]);
        op2 = (command[2]);
        op3 = (command[3]);
        params = [{ location: op1, price: op2, category: op3, limit: 5 }];
      }

      let outputText = "";
      yelp.query('businesses/search', params).then(data => {
        // Success
        result = JSON.parse(data); 
        if (result !== "undefined") {
          outputText = printBusinesses(result);
        } else {
          message.reply("An error was encountered."); 
        }
        // Check that your query returns an entry
        if (outputText.length > 0) {
          message.reply(outputText); 
        }
        else {
          message.reply("Query did not return a value.");
          if (!(op2 >= 1 && op2 <= 4)) {
            message.reply("You must enter 1-4 for the price range.");
          }
        }
      })
      .catch(err => {
        // Failure
        console.log(err);
      }); 
    }
    /**
     * COMMAND 6 - Reviews
     * Enter in the phone number of a business, and the API will return the text of three reviews
     */
    else if (command[0] == "reviews")
    {
      op1 = parseFloat(command[1]);
      let params = [{ phone: op1 }];
      let outputText = "";
      yelp.query('businesses/search/phone', params).then(data => {
        // Success 
        result = JSON.parse(data); 
        if (result !== "undefined") {
          // Get the ID of the business
          for (i in result.businesses) { 
            businessID = result.businesses[i].id;
            businessName = result.businesses[i].name;
            outputText += "Reviews for: " + businessName + "\n";
          }
          // Query the reviews
          yelp.query('businesses/' + businessID + '/reviews', params).then(data => {
            // Success 
            result = JSON.parse(data); 
            if (result !== "undefined") {
              for (i in result.reviews) { 
                // Review Rating
                rating = result.reviews[i].rating;
                if (rating !== "undefined" && rating !== null) {
                  outputText += "Rating: " + rating + "\n";
                } else {
                  outputText += "Rating: N/A\n";
                }  
                // Review User
                user = result.reviews[i].user.name;
                if (user !== "undefined") {
                  outputText += "User: " + user + "\n";
                } else {
                  outputText += "User: N/A\n";
                }  
                // Review Text
                text = result.reviews[i].text;
                if (text !== "undefined" && text !== null) {
                  outputText += "Review: " + text + "\n";
                } else {
                  outputText += "Review: N/A\n";
                }  
                // Review Link
                url = result.reviews[i].url;
                if (url !== "undefined" && url !== null) {
                  outputText += "Review Link: " + url + "\n";
                } else {
                  outputText += "Review: N/A\n";
                }  
              }
            } else {
              message.reply("An error was encountered.");
            }
            // Check that your query returns an entry
            if (outputText.length > 0) {
              message.reply(outputText); 
            }
            else {
              message.reply("Query did not return a value."); 
            }
          })
          .catch(err => {
            // Failure
            console.log(err);
          });
        } else {
          message.reply("An error was encountered."); 
        }
      })
      .catch(err => {
        // Failure
        console.log(err);
      });  
    }
    /**
     * COMMAND 7 - Search for events in Canada
     * Events are currently in Beta and was opted into.
     */
    else if (command[0] == "event")
    {
      // The city being queried
      op1 = (command[1]);
      let params = [{ location: op1, limit: 3 }];
      let outputText = "";
      yelp.query('events', params).then(data => {
        // Success
        result = JSON.parse(data); 
        for (i in result.events) {
          if (result.events[i] !== "undefined") {
            // Event Name
            eventName = result.events[i].name;
            if (eventName !== "undefined"  && eventName !== null) {
              outputText += "Event Name: " + eventName + "\n";
            } else {
              outputText += "Event Name: N/A\n";
            }  
            // Event Location
            location = result.events[i].location.address1;
            if (location !== "undefined"  && location !== null) {
              outputText += "Event Location: " + location + "\n";
            } else {
              outputText += "Event Location: N/A\n";
            }  
            // Event URL
            url = result.events[i].tickets_url;
            if (url !== "undefined" && url !== null) {
              outputText += "Event URL: " + url + "\n";
            } else {
              outputText += "Event URL: N/A\n";
            }    
          } else {
            message.reply("An error was encountered."); 
          }
        }
        // Check that your query returns an entry
        if (outputText.length > 0) {
          message.reply(outputText); 
        }
        else {
          message.reply("Query did not return a value."); 
        }
      })
      .catch(err => {
        // Failure
        console.log(err);
      }); 
    }
    /**
     * COMMAND NOT FOUND
     */
    else {
      message.reply("Invalid command."); 
    }
  }
});

// REQUIRES KEY
client.login("KEYHERE");
