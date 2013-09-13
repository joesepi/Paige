/* global beforeEach, afterEach */
var facebookUser, extend = require('nbd').util.extend,
    config = extend({}, require("../config.json")),
    Paige = require("../../paige"),
    facebook = Paige.Helpers.facebook,
    data = Paige.Helpers.data,
    bescribe = Paige.Helpers.bescribe;

bescribe("Facebook Signup", config, function(context, describe, it) {
  beforeEach(function(done) {
    // must redirect to a specific CI app server
    // as secret & app_id for facebook API is stupid
    config.test_address = config.facebook.ci_address;

    // wait for test user to be created
    facebook.createUser(config.facebook.appId, config.facebook.secret, function(user){
      facebookUser = user;
      done();
    });
  });

  afterEach(function(done) {
    // wait for user to get deleted
    facebook.deleteUser(facebookUser, function(response) {
      done();
    });
  });

  describe("flow", function() {
    it("is successful when Facebook user signs in", function() {
      context.Page.build()
      .resizeWindowTo({
        width: 1280,
        height: 1024
      })
      .open(facebookUser.login_url)
      .facebookSignin(facebookUser.email, facebookUser.password)
      .open()
      .clickSocialButton("facebookButton")
      .switchTo(Paige.SignUp.Info)
      .enterPassword("password")
      .enterInformation({
        firstName: data.firstName(),
        lastName: data.lastName(),
        username: data.username(),
        location: {
          country: "United States",
          state: "New York",
          city: "New York"
        },
        dob: {
          month: "October",
          day: "21",
          year: "1989"
        }
      })
      .switchTo(Paige.SignUp.Find)
      .followFirstCreative()
      .finishFollowing()
      .switchTo(Paige.Home.Welcome)
      .verifyFacebookSynced()
      .redirectTo(Paige.Profile.Info)
      .verifyProfileInfo({
        location: {
          country: "USA",
          state: "NY",
          city: "New York"
        }
      });
    });
  });
});
