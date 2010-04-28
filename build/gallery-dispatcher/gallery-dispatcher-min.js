YUI.add("gallery-dispatcher",function(B){var P=B.UA,I=B.ClassNameManager.getClassName,K="dispatcher",E=".",V="script",Q="start",U="purge",Z="change",W="load",H="uri",F="content",G="autopurge",T="loading",D=[G,T,F,H],S=I(K),C=I(K,"loading"),A=E+S,J=B.Lang,M=J.isBoolean,O=J.isString,N=J.isObject,R=function(){R.superclass.constructor.apply(this,arguments);};function X(Y){var L=B.Node.create("<div></div>"),a={};L.setContent(Y);a.js=L.all(V).each(function(b){L.removeChild(b);});a.content=L.get("innerHTML");return a;}B.mix(R,{NAME:K,_hashtable:[],ATTRS:{autopurge:{value:true,writeOnce:true,validator:M},uri:{value:null,setter:function(L){this.stop();this._io=this._fetch(L);return L;},validator:function(L){return(L&&O(L)&&(L!==""));}},content:{value:"",setter:function(L){this.stop();this._dispatch(L);return L;},validator:O},loading:{value:false,validator:M,setter:function(L){if(L){this._node.addClass(C);}else{this._node.removeClass(C);}return L;}}}});B.extend(R,B.Base,{_history:[],_node:null,_queue:null,_io:null,initializer:function(L){var Y=this;L=L||{};this._queue=new B.AsyncQueue();if(!N(L)||!L.node||!(this._node=B.one(L.node))){return;}B.Array.each(D,function(a){if(L[a]){Y.set(a,L[a]);}});this.publish(Q);this.publish(U);this.publish(Z);this.publish(W);},destructor:function(){this.stop();this._node=null;this._queue=null;this._io=null;},stop:function(){this._queue.stop();if(this._io){this._io.abort();}return this;},_dispatch:function(L){var a=X(L),Y=this._queue,b=this._node;if(this.get("autopurge")){Y.add({fn:function(){b.get("children").each(function(d){d.purge(true);});}});}Y.add({fn:function(){b.setContent(a.content);}});a.js.each(function(c){if(c&&c.get("src")){Y.add({fn:function(){B.Get.script(c.get("src"),{onFailure:function(d){},onEnd:function(d){d.purge();Y.run();}});},autoContinue:false});}else{Y.add({fn:function(){var g=c.get("ownerDocument"),f=g.one("head")||g.get("documentElement"),e=B.Node.create("<"+V+"></"+V+">");f.replaceChild(c,f.appendChild(e));if(c._node.text){e._node.text=c._node.text;}c.remove();}});}});this._queue.run();},_fetch:function(Y,L){if(!Y){return false;}L=L||{method:"GET"};L.on={start:function(){},success:function(a,b){this.set(F,b.responseText);},failure:function(a,b){},end:function(){}};L.context=this;return B.io(Y,L);},_destroy:function(L,Y){}});B.Dispatcher=R;},"gallery-2010.03.23-17-54",{requires:["base-base","node-base","io-base","get","async-queue","classnamemanager"]});
