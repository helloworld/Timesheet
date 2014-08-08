Days = new Meteor.Collection('days');


if (Meteor.isClient) {

  daysSub = Meteor.subscribe('days');

  Template.home.rendered = function () {
      $('h1').fitText(1.0); 
  };

  Template.home.helpers({
        date: function() {
            return moment().format("MMM Do");
        },
        dayOfWeek: function() {
           var index = moment().day();
           var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
           return days[index-1];
        }
  });

  Template.controls.helpers({
        dayOfWeek: function() {
           var index = moment().day();
           var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
           return days[index-1];
        }, 

        isWorkDay: function() {
          var index = moment().day();
          if(index < 6) {
            return true;
          }
          else {
            return false;
          }
        }
  });

 Template.controls.events({
    'click #startDay': function () {
      Days.insert({
        created_at: new Date,
        iso8601: moment().toISOString(),
        date: moment().format("MM-DD-YYYY"),
        didWork: true,
        startTime: moment().format("h:mm a"),
        endTime: null,
      });
      Router.go('today')
    }
  });

 Template.today.rendered = function () {
      $('h1').fitText(1.0);    
  };

  Template.today.helpers({
        todayInfo: function() {
           var today = Days.findOne({
              date: moment().format("MM-DD-YYYY")
            } 
           );


          Session.set("currentDay", today);

          return today;
        }, 
        timeago: function() {
          return Session.set("currentDay", today);

        },
        endtime: function() {
            return moment().format("h:mm a");
        },
        duration: function() {
            var a = moment( Session.get("currentDay").startTime);
            return moment( a ).fromNow();
        },
  });

  Template.today.events({
    'click #confirm': function () {
      $('#confirmModal').modal('show')
    },
    'click #finalSubmit': function () {
      Days.update(Session.get("currentDay"), {$set: {endTime: moment().format("h:mm a")}});
            $('#confirmModal').modal('hide')

      Router.go('/')
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {

  });

  Meteor.publish('days', function() {
        return Days.find({}, {
            sort: {
                created_at: 1
            }
        });
  });
}
