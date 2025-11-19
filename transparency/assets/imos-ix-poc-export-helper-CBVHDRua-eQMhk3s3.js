import{aY as R,aZ as c,d as P}from"./index-B6gMdnHJ.js";const I=(r,t)=>`${r.x.toFixed(t)},${r.y.toFixed(t)},${r.z.toFixed(t)}`,n=(r,t)=>{let o="";for(let e=0;e<t.length;e++)o+=`<${r}${e+1}>${t[e]}</${r}${e+1}>
    `;return o},T=r=>`<Head>
            <COMM>${r.comm}</COMM>
            <ARTICLENO>${r.articleno}</ARTICLENO>
            <CUSTOMER>${r.customer}</CUSTOMER>
            <RETAILER>${r.retailer}</RETAILER>
            <CLIENT>${r.client}</CLIENT>
            <PROGRAM>${r.program}</PROGRAM>
            <EMPLOYEE>${r.employee}</EMPLOYEE>
            <TEXT_LONG>${r.textLong}</TEXT_LONG>
            <TEXT_SHORT>${r.textShort}</TEXT_SHORT>

            ${n("COLOUR",r.colour)}
            ${n("INFO",r.info)}
            ${n("ADDRESS",r.address)}
            ${n("BILLING_ADDRESS",r.billingAddress)}
            ${n("SHIPPING_ADDRESS",r.shippingAddress)}
            ${n("ORDER_PRICE_INFO",r.orderPriceInfo)}
            ${n("CUSTOM_INFO",r.customInfo)}
        </Head>`,p=(r,t)=>`
                <Pname>${t.name}</Pname>
                <Count>${t.count}</Count>
                <PVarString>${t.attributes}</PVarString>
                <ARTICLE_TEXT_INFO1>${r.articleTextInfo1||""}</ARTICLE_TEXT_INFO1>
                <ARTICLE_TEXT_INFO2>${r.articleTextInfo2||""}</ARTICLE_TEXT_INFO2>
                <ARTICLE_PRICE_INFO1>${r.articlePriceInfo1||""}</ARTICLE_PRICE_INFO1>
                <ARTICLE_PRICE_INFO2>${r.articlePriceInfo2||""}</ARTICLE_PRICE_INFO2>
                <ARTICLE_PRICE_INFO3>${r.articlePriceInfo3||""}</ARTICLE_PRICE_INFO3>
                <Pinsertion>${I(t.position,2)}</Pinsertion>
                <POrntation>${I(t.rotation,2)}</POrntation>
                <DeliveryPeriod>${r.deliveryPeriod||""}</DeliveryPeriod>
                <LIEFERANT>${r.supplier||""}</LIEFERANT>
                <Mengenrabatt>${r.discount||0}</Mengenrabatt>
                <MengenrabattAbs>${r.discountAbs||""}</MengenrabattAbs>
  `,_=(r={},t)=>{let o="";for(let e=0;e<t.length;e++)o+=`<Set LineNo="${e+1}">${p(r,t[e])}</Set>
    `;return o},l=(r={},t={},o={},e)=>`<?xml version="1.0" encoding="UTF-8"?>
    <XML type="ListBuilder">
        <Order No="${r.orderNumber}" DispDate="${r.dispatchDate}" Basket="${r.basketNumber}">
            ${T(t)}
            <BuilderList>
                ${_(o,e.articles)}
            </BuilderList>
        </Order>
    </XML>
  `,E=()=>{const r=Math.floor(Math.random()*1e6).toString();return{orderNumber:"Order "+r,dispatchDate:"9/11/1911",basketNumber:r}},d=()=>({comm:"Rubens2Rembrand",articleno:"ExampleSIM",customer:"Roomle",retailer:"Retail",client:"Ex ClientName",program:"program",employee:"Homag",textLong:"long long long txt",textShort:"short txt",colour:["colour1","colour2","colour3","colour4","colour5"],info:["1Admin","2Firma_ABC","3Adresse_ABC","4PLZ_ABC","5Stadt_ABC","6","7","8","9","10","11","12"],address:["Admin","Firma_ABC","Adresse_ABC","PLZ_ABC","Stadt_ABC","Kundennummer_ABC","Land_ABC"],billingAddress:["Optional1","Optional2","Optional3","Optional4","Optional5","Optional6"],shippingAddress:["opt","opt","opt","opt","opt","opt"],orderPriceInfo:["000","Price002","Price003","Price004","Price005"],customInfo:["CustInf1","CustInf2","CustInf3","CustInf4","CustInf5","CustInf6","CustInf7","CustInf8","CustInf9","CustInf10"]}),C=()=>({}),L=async(r,t,o)=>{const e=R(r.objects);let a=[];for(const $ of e){const A=$.configurationRuntimeId;try{const s=JSON.parse(t.generateExport(c.HOMAGiX,A,o));a=a.concat(s.articles)}catch(s){return console.error(s),Promise.reject(`Could not create export JSON ${c.HOMAGiX}`)}}const i=E(),u=d(),m=C(),O=l(i,u,m,{articles:a});return P("IMOSiX.xml",O),Promise.resolve()},N=async(r,t,o,e,a="")=>{try{return o.setDefaultExportDataDefinition(a),Promise.resolve(JSON.parse(o.generateExport(t,r,e)))}catch(i){return console.error(i),Promise.reject(`Could not create export JSON ${t}`)}},f=(r,t={},o={},e={})=>(t=E(),o=d(),e=C(),l(t,o,e,r));export{l as createHomagIxXml,L as downloadHomagIxExportPoC,N as generateExportHomagIxConfiguration,C as getFakeArticleParams,d as getFakeHeaderParams,E as getFakeOrderParams,f as homagIxMockUpData};
