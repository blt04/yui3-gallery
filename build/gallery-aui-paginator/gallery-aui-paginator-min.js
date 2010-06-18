YUI.add("gallery-aui-paginator",function(AG){var w=AG.Lang,G=w.isArray,AV=w.isBoolean,AT=w.isFunction,n=w.isNumber,g=w.isObject,Aa=w.isString,d="alwaysVisible",Q="boundingBox",D="container",j="containers",AB="content",AP="current",v=".",a="first",AI="firstPageLink",Ah="firstPageLinkLabel",H="last",l="lastPageLink",Ad="lastPageLinkLabel",AC="link",AL="maxPageLinks",O="next",AS="nextPageLink",AF="nextPageLinkLabel",R="page",Z="pageContainerTemplate",k="pageLinkContent",i="pageLinkTemplate",F="pageReportEl",X="pageReportLabelTemplate",AK="paginator",AU="per",AW="prev",K="prevPageLink",C="prevPageLinkLabel",z="report",M="rows",AJ="rowsPerPage",Ac="rowsPerPageEl",W="rowsPerPageOptions",m="select",T=" ",s="state",AR="template",AE="total",o="totalEl",u="totalLabel",AD="totalPages",U=function(A){return AG.one(A);},Ab=function(){return Array.prototype.slice.call(arguments).join(T);},Ae=function(A){return(A instanceof AG.NodeList);},Af=function(A){return parseInt(A,10)||0;},f=AG.ClassNameManager.getClassName,b=f(AK),V=f(AK,D),AM=f(AK,AB),c=f(AK,AP,R),Ag=f(AK,a,AC),N=f(AK,H,AC),AY=f(AK,AC),E=f(AK,O,AC),B=f(AK,R,D),AO=f(AK,R,AC),Y=f(AK,AP,R,z),AN=f(AK,AW,AC),S=f(AK,M,AU,R),J=f(AK,AE),t="(Total {total})",q="({page} of {totalPages})",y="{FirstPageLink} {PrevPageLink} {PageLinks} {NextPageLink} {LastPageLink} {CurrentPageReport} {Total} {RowsPerPageSelect}",AQ="&gt;",p="&lt;",I='<a href="#" class="'+Ab(AY,Ag)+'"></a>',AA='<a href="#" class="'+Ab(AY,N)+'"></a>',h='<a href="#" class="'+Ab(AY,E)+'"></a>',AZ="<span></span>",x='<a href="#"></a>',P='<span class="'+Ab(Y)+'"></span>',AX='<a href="#" class="'+Ab(AY,AN)+'"></a>',AH='<select class="'+S+'"></select>',r='<span class="'+Ab(J)+'"></span>';var e=AG.Component.create({NAME:AK,ATTRS:{alwaysVisible:{value:true,validator:AV},containers:{writeOnce:true,setter:function(L){var A=this;if(Ae(L)){return L;}else{if(Aa(L)){return AG.all(L);}}return new AG.NodeList([L]);}},firstPageLink:{setter:U,valueFn:function(){var A=this.get(Ah);return AG.Node.create(I).html(A);}},firstPageLinkLabel:{value:a,validator:Aa},lastPageLink:{setter:U,valueFn:function(){var A=this.get(Ad);return AG.Node.create(AA).html(A);}},lastPageLinkLabel:{value:H,validator:Aa},maxPageLinks:{value:10,getter:function(A){var L=this.get(AD);return Math.min(L,A);},validator:n},nextPageLink:{setter:U,valueFn:function(){var A=this.get(AF);return AG.Node.create(h).html(A);}},nextPageLinkLabel:{value:Ab(O,AQ),validator:Aa},page:{setter:function(A){return Af(A);},value:1},pageContainerTemplate:{getter:function(A){return AG.Node.create(A).addClass(B);},value:AZ,validator:Aa},pageLinkContent:{value:function(Ai,A,L){Ai.html(A);},validator:AT},pageLinkTemplate:{getter:function(A){var L=AG.Node.create(A);return L.addClass(Ab(AY,AO));},value:x,validator:Aa},pageReportEl:{setter:U,valueFn:function(){var A=this.get(X);return AG.Node.create(P).html(A);}},pageReportLabelTemplate:{getter:function(){var A=this;return AG.substitute(q,{page:A.get(R),totalPages:A.get(AD)});},validator:Aa},prevPageLink:{setter:U,valueFn:function(){var A=this.get(C);return AG.Node.create(AX).html(A);}},prevPageLinkLabel:{value:Ab(p,AW),validator:Aa},rowsPerPageOptions:{value:{},validator:G},rowsPerPage:{setter:function(A){return Af(A);},value:1},rowsPerPageEl:{setter:U,valueFn:function(){return AG.Node.create(AH);}},state:{setter:function(A){return this._setState(A);},getter:function(A){return this._getState(A);},value:{},validator:g},template:{getter:function(A){return this._getTemplate(A);},writeOnce:true,value:y,validator:Aa},total:{setter:function(A){return this._setTotal(A);},value:0,validator:n},totalEl:{setter:U,valueFn:function(){var A=this.get(u);return AG.Node.create(r).html(A);}},totalLabel:{getter:function(){var A=this;return AG.substitute(t,{total:A.get(AE)});},validator:Aa},totalPages:{readOnly:true,getter:function(A){return Math.ceil(this.get(AE)/this.get(AJ));}}},prototype:{lastState:null,templatesCache:null,renderUI:function(){var A=this;var L=A.get(j);L.unselectable();A._renderRowsPerPageOptions();A._renderTemplateUI();L.addClass(V);},bindUI:function(){var A=this;A._delegateDOM();A.publish("changeRequest");A.after("stateChange",AG.bind(A._afterSetState,A));A.before("stateChange",AG.bind(A._beforeSetState,A));A.after("maxPageLinksChange",AG.bind(A._renderTemplateUI,A));A.after("rowsPerPageChange",AG.bind(A._renderTemplateUI,A));A.after("totalChange",AG.bind(A._renderTemplateUI,A));},syncUI:function(){var A=this;A.changeRequest();},destroy:function(){var A=this;A.get(Q).remove();A.get(j).remove();},_syncPageLinksUI:function(){var A=this;var Aj=A.get(j);var Ai=A.get(R);var L=A.calculateRange(Ai);Aj.each(function(Am){var Al=0;var Ak=L.start;var Ao=Am.all(v+AO);if(Ao){Ao.removeClass(c);while(Ak<=L.end){var An=Ao.item(Al);A.get(k).apply(A,[An,Ak,Al]);An.setAttribute(R,Ak);if(Ak==Ai){An.addClass(c);}Al++;Ak++;}}});},_syncPageReportUI:function(L){var A=this;var Ai=A.get(j);Ai.each(function(Aj){var Ak=Aj.one(v+Y);if(Ak){Ak.html(A.get(X));}});},calculateRange:function(Aj){var A=this;var Ai=A.get(AD);var Am=A.get(AL);var Ak=Math.ceil(Am/2);var Al=Math.min(Math.max(Aj-Ak,1),(Ai-Am+1));var L=Math.min(Al+Am-1,Ai);return{start:Al,end:L};},changeRequest:function(){var A=this;var L=A.get(s);A.fire("changeRequest",{state:L});},eachContainer:function(L){var A=this;A.get(j).each(function(Ai){if(Ai){L.apply(A,arguments);}});},hasNextPage:function(){var A=this;return A.hasPage(A.get(R)+1);},hasPage:function(Ai){var A=this;var L=A.get(AD);return((Ai>0)&&(Ai<=L));},hasPrevPage:function(){var A=this;return A.hasPage(A.get(R)-1);},_renderRowsPerPageOptions:function(){var A=this;var Ai=0;var L=A.get(Ac);var Aj=A.get(W);AG.each(Aj,function(Ak){L.getDOM().options[Ai++]=new Option(Ak,Ak);});},_renderTemplateUI:function(){var A=this;var L=A.get(j);A.templatesCache=null;L.html(A.get(AR));A._syncPageLinksUI();A._syncPageReportUI();A._bindDOMEvents();},setState:function(L){var A=this;A.set(s,L);},_getState:function(L){var A=this;return{before:A.lastState,paginator:A,page:A.get(R),total:A.get(AE),totalPages:A.get(AD),rowsPerPage:A.get(AJ)};
},_getTemplate:function(L){var A=this;var Ai=function(An){return A.get(An).outerHTML();};if(!A.templatesCache){var Al=0;var Ak=A.get(AD);var Am=A.get(AL);var Aj=A.get(Z);while(Al++<Am){Aj.append(A.get(i));}A.templatesCache=AG.substitute(L,{CurrentPageReport:Ai(F),FirstPageLink:Ai(AI),LastPageLink:Ai(l),NextPageLink:Ai(AS),PageLinks:Aj.outerHTML(),PrevPageLink:Ai(K),RowsPerPageSelect:Ai(Ac),Total:Ai(o)});}return A.templatesCache;},_setState:function(L){var A=this;AG.each(L,function(Aj,Ai){A.set(Ai,Aj);});return L;},_setTotal:function(Ai){var A=this;var L=A.get(d);var Aj=A.get(j);if(!L&&(Ai===0)){Aj.hide();}else{Aj.show();}return Ai;},_afterSetState:function(L){var A=this;A._syncPageLinksUI();A._syncPageReportUI();},_beforeSetState:function(L){var A=this;A.lastState=L.prevVal;},_onClickFirstLinkEl:function(L){var A=this;A.set(R,1);A.changeRequest();L.halt();},_onClickPrevLinkEl:function(L){var A=this;if(A.hasPrevPage()){var Ai=A.get(R);A.set(R,Ai-1);A.changeRequest();}L.halt();},_onClickPageLinkEl:function(Ai){var A=this;var L=Ai.currentTarget.attr(R);A.set(R,L);A.changeRequest();Ai.halt();},_onClickNextLinkEl:function(L){var A=this;if(A.hasNextPage()){var Ai=A.get(R);A.set(R,Ai+1);A.changeRequest();}L.halt();},_onClickLastLinkEl:function(Ai){var A=this;var L=A.get(AD);A.set(R,L);A.changeRequest();Ai.halt();},_bindDOMEvents:function(){var A=this;A.eachContainer(function(Ai){var L=Ai.one(v+S);if(L){L.val(A.get(AJ));L.detach("change");L.on("change",function(Ak){var Aj=A.get(AJ);try{Aj=Ak.target.val();}catch(Al){}A.set(R,1);A.set(AJ,Aj);A.changeRequest();});}});},_delegateDOM:function(){var A=this;A.eachContainer(function(Ai,L){Ai.delegate("click",AG.bind(A._onClickFirstLinkEl,A),v+Ag);Ai.delegate("click",AG.bind(A._onClickPrevLinkEl,A),v+AN);Ai.delegate("click",AG.bind(A._onClickPageLinkEl,A),v+AO);Ai.delegate("click",AG.bind(A._onClickNextLinkEl,A),v+E);Ai.delegate("click",AG.bind(A._onClickLastLinkEl,A),v+N);});}}});AG.Paginator=e;},"gallery-2010.06.07-17-52",{skinnable:true,requires:["gallery-aui-base","substitute"]});