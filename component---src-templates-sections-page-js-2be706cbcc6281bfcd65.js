(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{Ln4y:function(e,t,a){"use strict";a.r(t),a.d(t,"query",(function(){return r}));var n=a("q1tI"),l=a.n(n),m=a("Bl7J"),c=a("vFAX"),r="3223760219";t.default=function(e){var t=e.data.kontentItemSectionsPage,a=t.elements.sections.value.map((function(e,t){var a=e.elements.image.value.length>0?l.a.createElement("a",{href:e.elements.cta.value[0].elements.external_url.value,className:"image"},l.a.createElement("img",{src:e.elements.image.value[0].url,alt:e.elements.image.value[0].description||e.elements.image.value[0].name,"data-kontent-element-codename":"image"})):null,n=e.elements.cta.value.length>0?e.elements.cta.value.map((function(e){return l.a.createElement("li",{key:e.elements.external_url.value},l.a.createElement("a",{href:e.elements.external_url.value,className:"button"},e.elements.title.value))})):null,m=0===t?l.a.createElement("h2",null,e.elements.header.value):l.a.createElement("h3",null,e.elements.header.value);return l.a.createElement("section",{className:a&&"spotlights","data-kontent-item-id":e.system.id},a,l.a.createElement("div",{className:"content"},l.a.createElement("div",{className:"inner"},l.a.createElement("header",{className:"major","data-kontent-element-codename":"header"},m),l.a.createElement("p",{dangerouslySetInnerHTML:{__html:e.elements.content.value},"data-kontent-element-codename":"content"}),l.a.createElement("ul",{className:"actions",style:{display:"inline-block"},"data-kontent-element-codename":"cta"},n))))}));return l.a.createElement(m.a,null,l.a.createElement("div",{"data-kontent-item-id":t.system.id},l.a.createElement(c.a,{title:t.elements.header.value,content:t.elements.summary.value,heroImage:t.elements.hero_image.value.length>0?t.elements.hero_image.value[0].localFile.childImageSharp.fluid:void 0,titleCodename:"header",contentCodename:"summary"})),l.a.createElement("div",{id:"main","data-kontent-item-id":t.system.id},a))}},vFAX:function(e,t,a){"use strict";var n=a("q1tI"),l=a.n(n),m=a("Wbzz"),c=a("9eSz"),r=a.n(c);t.a=function(e){return l.a.createElement("section",{id:"banner",className:"style"+(Math.floor(6*Math.random())+1)},e.heroImage&&l.a.createElement(r.a,{fluid:e.heroImage,style:{position:"absolute",left:0,top:0,width:"100%",height:"100%"},imgStyle:{objectPosition:"75% 25%"}}),l.a.createElement("div",{className:"inner"},l.a.createElement("header",{className:"major"},l.a.createElement("h1",{"data-kontent-element-codename":e.titleCodename},e.title)),l.a.createElement("div",{className:"content",dangerouslySetInnerHTML:{__html:e.content},"data-kontent-element-codename":e.contentCodename}),e.button&&l.a.createElement("div",{className:"content"},l.a.createElement(m.Link,{className:"button icon fa-angle-double-left",to:e.button.to},e.button.title))))}}}]);
//# sourceMappingURL=component---src-templates-sections-page-js-2be706cbcc6281bfcd65.js.map