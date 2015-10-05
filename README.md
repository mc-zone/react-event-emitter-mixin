# react-event-emitter-mixin
Custom event utilities with lifecycle maintenance for react (both react and react-native)


## Getting Started
Install via npm
```bash
npm i react-event-emitter-mixin --save-dev
```

## Useage
Communicate between components under event emitter.
```javascript
var EventEmitterMixin = require('react-event-emitter-mixin');

var Child = React.createClass({
    mixins:[EventEmitterMixin],
    name:'child',
    render(){
        return (
            <View>
                <TouchableOpacity
                    onPress={()=>{
                        this.eventEmitter('emit','eventA','foo','bar');
                    }}
                >
                    <Text>press to emit event</Text>
                </TouchableOpacity>
            </View>
        );
    }
});
var Parent = React.createClass({
    mixins:[EventEmitterMixin],
    name:'parent',
    componentWillMount(){
        this.eventEmitter('on','eventA',(a,b)=>{
            alert(this.name); //'parent'
            alert(a+b); //'foobar'
        });
    },
    render(){
        return (
            <View style={{paddingTop:100}}>
                <Child />
            </View>
        );
    }
});

```


## Lifecycle maintenance
Auto clean listeners when components be unmounted.
```javascript
var Child = React.createClass({
    mixins:[EventEmitterMixin],
    componentWillMount(){
        this.eventEmitter('on','eventB',()=>{
            alert('Will not show if `Child` was unmounted or not mounted')
        });
        this.eventEmitter('one','eventB',()=>{
            alert('Once time per lifecycle')
        });
    },
    render(){
        //...
    }
});
var Parent = React.createClass({
    mixins:[EventEmitterMixin],
    name:'parent',
    getInitialState(){
        return {
            mountChild:true,
        }
    },
    render(){
        return (
            <View style={{paddingTop:100}}>
                {this.state.mountChild && (
                    <Child />
                )}
                <TouchableOpacity
                    onPress={()=>{
                        this.setState({mountChild:!this.state.mountChild})
                    }}
                >
                    <Text>mount/unmount child</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>{
                        this.eventEmitter('emit','eventB');
                    }}
                >
                    <Text>press to emit event</Text>
                </TouchableOpacity>
            </View>
        );
    }
});

```


## API
```javascript
//Add event listener
this.eventEmitter('on', eventName:string, callback:function);

//Add once-only (per lifecycle) event listener
this.eventEmitter('one', eventName:string, callback:function);

//Remove event listeners which come from current component (or remove all)
this.eventEmitter('off', eventName:string, callback:function, shouldRemoveAll:Boolean);

//Emit event 
this.eventEmitter('emit', eventName:string [,data1 [,data2,...] ] );
```

## LICENSE
MIT.


## Welcome PR :)