
Places = new Meteor.Collection("places");

graph = {
    // a b c
    // d e f
    // g h i
    // j k l
    a: {b: 1, d: 1},
    b: {a: 1, c: 1, e: 1},
    c: {b: 1, f: 1},
    d: {a: 1, e: 1, g: 1},
    e: {b: 1, d: 1, f: 1, h: 1},
    f: {c: 1, e: 1, i: 1},
    g: {d: 1, h: 1},
    h: {e: 1, g: 1, i: 1, k: 1},
    i: {f: 1, h: 1},
    j: {g: 1, k: 1},
    k: {j: 1, h: 1, l: 1},
    l: {k: 1, i: 1}
};

if (Meteor.is_client) {
    Template.main.directions = function() {
	var result = [];
	var path = Session.get('path');
	if(path != null) {
	    result = Places.find({ code: {$in: path} });
	}
	return result;
    }

    Template.main.start = function() { 
	var start = null;
	if (Session.get('path')) {
	    start = Session.get('start'); 
	}
	return start;
    }

    Template.main.end = function() { 
	var end = null;
	if (Session.get('path')) {
	    end = Session.get('end'); 
	}
	return end;
    }

    Template.main.places = function() {
	return Places.find({});
    }
    
  Template.main.events = {
    'click button.search' : function () {
	var start = Places.findOne({name: {$regex:'.*'+$('#start').val()+'.*', $options:'i'}});
	var end = Places.findOne({name: {$regex:'.*'+$('#end').val()+'.*', $options:'i'}});
	if (start && end) {
	    var path = dijkstra.find_path(graph, start.code, end.code);
	    Session.set('path', path);
	    Session.set('start', start.name);
	    Session.set('end', end.name);
	} else {
	    Session.set('path', null);
	}
    }
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
	  if (Places.find().count() == 0) {
	      var landmarks = [
		  ['a', 'Starmall'],
		  ['b', 'MRT Shaw'],
		  ['c', 'SM Megamall'],
		  ['d', 'Wendys Boni'],
		  ['e', 'MRT Boni'],
		  ['f', 'Robinsons Pioneer'],
		  ['g', 'Glorietta'],
		  ['h', 'MRT Ayala'],
		  ['i', 'The Fort'],
		  ['j', 'PNR Edsa'],
		  ['k', 'MRT Magallanes'],
		  ['l', 'South Superhighway']
	      ];
	      for (var i=0; i < landmarks.length; i++ ) {
		  Places.insert({code:landmarks[i][0], name:landmarks[i][1]});
	      }
	  }
	  Session.set('path', null);
  });
}