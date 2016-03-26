jest.unmock('../../'); 

var EventEmitterMixin = require('../../');

describe('Event listener and emitter test', function(){
  var ComponentA = Object.create(EventEmitterMixin);
  var ComponentB = Object.create(EventEmitterMixin);
  ComponentA.componentWillMount();
  ComponentB.componentWillMount();

  it('should be called when `emit` a listened event', function(){
    ComponentA.eventEmitter('on', 'event1', function(data){
      expect(data).toBe('foo');
    })  
    ComponentB.eventEmitter('emit', 'event1', 'foo')
  });

  it('should be called many times when use `on`', function(){
    var cnt = 0;
    ComponentB.eventEmitter('on', 'event3', function(){
      cnt ++;
    })  
    ComponentA.eventEmitter('emit', 'event3');
    ComponentA.eventEmitter('emit', 'event3');
    ComponentA.eventEmitter('emit', 'event3');

    expect(cnt).toBe(3);
  });

  it('should only be called once when use `one`', function(){
    var cnt = 0;
    ComponentB.eventEmitter('one', 'event4', function(){
      cnt ++;
    })  
    ComponentA.eventEmitter('emit', 'event4');
    ComponentA.eventEmitter('emit', 'event4');

    expect(cnt).toBe(1);
  });

  it('shouldn\'t be called after use `off` to remove a event', function(){
    var hasCalled = false;
    ComponentA.eventEmitter('on', 'event5', function(){
      hasCalled = true;
    });
    ComponentA.eventEmitter('off', 'event5');

    ComponentB.eventEmitter('emit', 'event5');

    expect(hasCalled).toBe(false);
  });

  it('shouldn\'t have event to be called after the Component has been unmounted', function(){
    var hasCalled = false;
    ComponentA.eventEmitter('on', 'event6', function(){
      hasCalled = true;
    });
    ComponentA.eventEmitter('one', 'event7', function(){
      hasCalled = true;
    });
    ComponentA.componentWillUnmount();

    ComponentB.eventEmitter('emit', 'event6');
    ComponentB.eventEmitter('emit', 'event7');

    expect(hasCalled).toBe(false);
  });
});
