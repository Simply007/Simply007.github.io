(self.webpackChunkondrej_chrastina_personal_site=self.webpackChunkondrej_chrastina_personal_site||[]).push([[961],{5602:function(e,t,n){"use strict";var a=n(7294),l=n(5444),m=n(1980);t.Z=function(e){return a.createElement("section",{id:"banner","data-kontent-item-id":e.itemId,className:"style"+(Math.floor(6*Math.random())+1)},e.heroImage&&a.createElement(m.Kn,{image:e.heroImage,style:{position:"absolute",left:0,top:0,width:"100%",height:"100%"},imgStyle:{objectPosition:"75% 25%"}}),a.createElement("div",{className:"inner"},a.createElement("header",{className:"major"},a.createElement("h1",{"data-kontent-element-codename":e.titleCodename},e.title)),a.createElement("div",{className:"content",dangerouslySetInnerHTML:{__html:e.content},"data-kontent-element-codename":e.contentCodename}),e.button&&a.createElement("div",{className:"content"},a.createElement(l.Link,{className:"button icon fa-angle-double-left",to:e.button.to},e.button.title))))}},1086:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return r}});var a=n(7294),l=n(4348),m=n(5602),s=function(e){var t=e.section,n=e.isFirst,l=t.elements.image.value.length>0?a.createElement("a",{href:t.elements.cta.value[0].elements.external_url.value,className:"image"},a.createElement("img",{src:t.elements.image.value[0].url,alt:t.elements.image.value[0].description||t.elements.image.value[0].name,"data-kontent-element-codename":"image"})):null,m=t.elements.cta.value.length>0?t.elements.cta.value.map((function(e){return a.createElement("li",{key:e.elements.external_url.value},a.createElement("a",{href:e.elements.external_url.value,className:"button"},a.createElement("span",{className:e.elements.icon.value?"icon "+e.elements.icon.value:void 0},e.elements.title.value)))})):null,s=n?a.createElement("h2",null,t.elements.header.value):a.createElement("h3",null,t.elements.header.value);return a.createElement("section",{className:l&&"spotlights","data-kontent-item-id":t.system.id},l,a.createElement("div",{className:"content"},a.createElement("div",{className:"inner"},a.createElement("header",{className:"major","data-kontent-element-codename":"header"},s),a.createElement("div",{dangerouslySetInnerHTML:{__html:t.elements.content.value},"data-kontent-element-codename":"content"}),a.createElement("ul",{className:"actions",style:{display:"inline-block"},"data-kontent-element-codename":"cta"},m))))},r=function(e){var t=e.data.kontentItemSectionsPage,n=t.elements.sections.value.map((function(e,t){return a.createElement(s,{section:e,isFirst:0===t})}));return a.createElement(l.Z,null,a.createElement("div",{"data-kontent-item-id":t.system.id},a.createElement(m.Z,{title:t.elements.header.value,content:t.elements.summary.value,heroImage:t.elements.hero_image.value.length>0?t.elements.hero_image.value[0]:void 0,titleCodename:"header",contentCodename:"summary"})),a.createElement("div",{id:"main","data-kontent-item-id":t.system.id},n))}}}]);
//# sourceMappingURL=component---src-templates-sections-page-js-b9d2f67b61b47fa48863.js.map