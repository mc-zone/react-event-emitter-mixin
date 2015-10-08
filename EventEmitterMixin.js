'use strict';

var GLOBAL = typeof window === 'undefined' ? global : window;

var _events = GLOBAL.EVENT_EMITTER = {};

var _signCnt = 0;

var EventEmitter = {
    mount(){
        this._eventIncluded = [];
        this._eventSign = '_eventTag_' + (_signCnt++);
    },
    unmount(){
        this._eventIncluded.forEach(event => delete _events[event][this._eventSign]);
        this._eventIncluded = [];
    },

    /**
     * on
     *
     * @param {string} event :Event name
     * @param {function} callback :Callback
     */
    on(event,callback){
        _events[event] || (_events[event] = {});
        callback.self = this; //save current `this` reference 
        if(_events[event][this._eventSign]){
            _events[event][this._eventSign].push(callback);
        }else{
            _events[event][this._eventSign] = [callback];
        }
        if( !~this._eventIncluded.indexOf(event) ){
            this._eventIncluded.push(event);
        }
    },

    /**
     * one
     *
     * @param {string} event :Event name
     * @param {function} callback :Callback
     */
    one(event,callback){
        var proxy = function(...data){
            EventEmitter.off.call(this,event,proxy);
            callback.apply(this,data);
        };
        EventEmitter.on.call(this,event,proxy);
    },

    /**
     * off
     *
     * @param {string} event :Event name
     * @param {function} callback :Callback
     * @param {boolean} removeAll :Should remove event of all components
     */
    off(event,callback,removeAll){
        if(!_events[event]) return ;
        
        if(removeAll){ //remove the event of all components
            if(!callback){
                _events[event] = {};
                var currentRegi = this._eventIncluded.indexOf(event);
                (~currentRegi) && this._eventIncluded.splice(currentRegi,1);
            }else{
                for(var _sign in _events[event]){
                    var index = _events[event][_sign].indexOf(callback);
                    (~index) && _events[event][_sign].splice(index,1);
        
                    if(!_events[event][_sign].length){
                        if(_sign == this._eventSign){
                            var currentRegi = this._eventIncluded.indexOf(event);
                            (~currentRegi) && this._eventIncluded.splice(currentRegi,1);
                        }
                        delete _events[event][_sign];
                    }
                }
            }
        }else{ //only remove the event of current component
            if(!_events[event][this._eventSign]) return ;
            if(!callback){
                if(_events[event][this._eventSign]){
                    delete _events[event][this._eventSign];
                    this._eventIncluded.splice(this._eventIncluded.indexOf(event),1);
                }
            }else if(_events[event][this._eventSign]){
                var index = _events[event][this._eventSign].indexOf(callback);

                (~index) && _events[event][this._eventSign].splice(index,1);
        
                if(!_events[event][this._eventSign].length){
                    delete _events[event][this._eventSign];
                    this._eventIncluded.splice(this._eventIncluded.indexOf(event),1);
                }
            }
        }
    },

    /**
     * emit
     *
     * @param {string} event :Event name
     */
    emit(event,...data){
        if(!_events[event]) return ;

        for(var _sign in _events[event]){
            var list = _events[event][_sign].slice(0); //might be removed by nested `off`
            list.forEach((cb)=>{
                cb.apply(cb.self,data); // `this` point to component which bind this callback
            });
            list = null;
        }
    },
};

var EventEmitterMixin = {
    componentWillMount(){
        EventEmitter.mount.call(this);
    },
    componentWillUnmount(){
        EventEmitter.unmount.call(this);
    },
    eventEmitter(type,...data){
        EventEmitter[type].apply(this,data); 
    },
};

module.exports = EventEmitterMixin;
