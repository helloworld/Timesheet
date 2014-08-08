Days = new Meteor.Collection('days');


if (Meteor.isClient) {

  daysSub = Meteor.subscribe('days');

  Template.home.rendered = function () {
      $('h1').fitText(1.0); 
  };

  Template.home.helpers({
        newDay: function() {
          var today = Days.findOne({
              date: moment().format("MM-DD-YYYY")
            } 
           );

          console.log(today);

          if( today != undefined && today.date == moment().format("MM-DD-YYYY") )
          {
            console.log(true);
            Router.go('today');
          }
          else{
            console.log(false);
            delete Session.keys['currentDay'];
            return true;
          }
        },
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
        date: function() {
            return moment().format("MMM Do");
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
            var temp = Session.get("currentDay");
            console.log(temp);
            var a = moment( temp.iso8601);
            var milli = moment().diff(a);
            var d = moment.duration(milli, 'milliseconds');
            var hours = Math.floor(d.asHours());
            var mins = Math.floor(d.asMinutes()) - hours * 60;
            return hours + " hours, " + mins + " mins";
        },
        pay: function() {
            var temp = Session.get("currentDay");
            console.log(temp);
            var a = moment( temp.iso8601);
            var milli = moment().diff(a);
            var d = moment.duration(milli, 'milliseconds');
            var hours = Math.floor(d.asHours());
            var mins = Math.floor(d.asMinutes()) - hours * 60;
            return "$"+(hours + mins/60)*15;
        }
  });

  Template.today.events({
    'click #confirm': function () {
      $('#confirmModal').modal('show')
    },
    'click #finalSubmit': function () {
      var temp = Session.get("currentDay");
      console.log(temp);
      var a = moment( temp.iso8601);
      var milli = moment().diff(a);
      var d = moment.duration(milli, 'milliseconds');
      var hours = Math.floor(d.asHours());
      var mins = Math.floor(d.asMinutes()) - hours * 60;
      var durationString = hours + " hours, " + mins + " mins";
      var payAmount = (hours + mins/60)*15;
      Days.update(Session.get("currentDay")._id, {$set: {endTime: moment().format("h:mm a"), duration: durationString, pay: payAmount }});
      $('#confirmModal').modal('hide')

      Router.go('/')
    }
  });

  Template.overview.helpers({
    items: function() {
            return Days.find({}, {
                sort: {
                    created_at: -1
                }
            });
    },
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
