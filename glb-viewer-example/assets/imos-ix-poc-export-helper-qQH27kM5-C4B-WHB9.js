import{Qn as e,zi as t,zr as n}from"./index-BPCKOvYy.js";var r=(e,t)=>`${e.x.toFixed(t)},${e.y.toFixed(t)},${e.z.toFixed(t)}`,i=(e,t)=>{let n=``;for(let r=0;r<t.length;r++)n+=`<${e}${r+1}>${t[r]}</${e}${r+1}>
    `;return n},a=e=>`<Head>
            <COMM>${e.comm}</COMM>
            <ARTICLENO>${e.articleno}</ARTICLENO>
            <CUSTOMER>${e.customer}</CUSTOMER>
            <RETAILER>${e.retailer}</RETAILER>
            <CLIENT>${e.client}</CLIENT>
            <PROGRAM>${e.program}</PROGRAM>
            <EMPLOYEE>${e.employee}</EMPLOYEE>
            <TEXT_LONG>${e.textLong}</TEXT_LONG>
            <TEXT_SHORT>${e.textShort}</TEXT_SHORT>

            ${i(`COLOUR`,e.colour)}
            ${i(`INFO`,e.info)}
            ${i(`ADDRESS`,e.address)}
            ${i(`BILLING_ADDRESS`,e.billingAddress)}
            ${i(`SHIPPING_ADDRESS`,e.shippingAddress)}
            ${i(`ORDER_PRICE_INFO`,e.orderPriceInfo)}
            ${i(`CUSTOM_INFO`,e.customInfo)}
        </Head>`,o=(e,t)=>`
                <Pname>${t.name}</Pname>
                <Count>${t.count}</Count>
                <PVarString>${t.attributes}</PVarString>
                <ARTICLE_TEXT_INFO1>${e.articleTextInfo1||``}</ARTICLE_TEXT_INFO1>
                <ARTICLE_TEXT_INFO2>${e.articleTextInfo2||``}</ARTICLE_TEXT_INFO2>
                <ARTICLE_PRICE_INFO1>${e.articlePriceInfo1||``}</ARTICLE_PRICE_INFO1>
                <ARTICLE_PRICE_INFO2>${e.articlePriceInfo2||``}</ARTICLE_PRICE_INFO2>
                <ARTICLE_PRICE_INFO3>${e.articlePriceInfo3||``}</ARTICLE_PRICE_INFO3>
                <Pinsertion>${r(t.position,2)}</Pinsertion>
                <POrntation>${r(t.rotation,2)}</POrntation>
                <DeliveryPeriod>${e.deliveryPeriod||``}</DeliveryPeriod>
                <LIEFERANT>${e.supplier||``}</LIEFERANT>
                <Mengenrabatt>${e.discount||0}</Mengenrabatt>
                <MengenrabattAbs>${e.discountAbs||``}</MengenrabattAbs>
  `,s=(e={},t)=>{let n=``;for(let r=0;r<t.length;r++)n+=`<Set LineNo="${r+1}">${o(e,t[r])}</Set>
    `;return n},c=(e={},t={},n={},r)=>`<?xml version="1.0" encoding="UTF-8"?>
    <XML type="ListBuilder">
        <Order No="${e.orderNumber}" DispDate="${e.dispatchDate}" Basket="${e.basketNumber}">
            ${a(t)}
            <BuilderList>
                ${s(n,r.articles)}
            </BuilderList>
        </Order>
    </XML>
  `,l=()=>{let e=Math.floor(Math.random()*1e6).toString();return{orderNumber:`Order `+e,dispatchDate:`9/11/1911`,basketNumber:e}},u=()=>({comm:`Rubens2Rembrand`,articleno:`ExampleSIM`,customer:`Roomle`,retailer:`Retail`,client:`Ex ClientName`,program:`program`,employee:`Homag`,textLong:`long long long txt`,textShort:`short txt`,colour:[`colour1`,`colour2`,`colour3`,`colour4`,`colour5`],info:[`1Admin`,`2Firma_ABC`,`3Adresse_ABC`,`4PLZ_ABC`,`5Stadt_ABC`,`6`,`7`,`8`,`9`,`10`,`11`,`12`],address:[`Admin`,`Firma_ABC`,`Adresse_ABC`,`PLZ_ABC`,`Stadt_ABC`,`Kundennummer_ABC`,`Land_ABC`],billingAddress:[`Optional1`,`Optional2`,`Optional3`,`Optional4`,`Optional5`,`Optional6`],shippingAddress:[`opt`,`opt`,`opt`,`opt`,`opt`,`opt`],orderPriceInfo:[`000`,`Price002`,`Price003`,`Price004`,`Price005`],customInfo:[`CustInf1`,`CustInf2`,`CustInf3`,`CustInf4`,`CustInf5`,`CustInf6`,`CustInf7`,`CustInf8`,`CustInf9`,`CustInf10`]}),d=()=>({}),f=async(r,i,a)=>{let o=t(r.objects),s=[];for(let e of o){let t=e.configurationRuntimeId;try{let e=JSON.parse(i.generateExport(n.HOMAGiX,t,a));s=s.concat(e.articles)}catch(e){return console.error(e),Promise.reject(`Could not create export JSON ${n.HOMAGiX}`)}}return e(`IMOSiX.xml`,c(l(),u(),d(),{articles:s})),Promise.resolve()},p=async(e,t,n,r,i=``)=>{try{return n.setDefaultExportDataDefinition(i),Promise.resolve(JSON.parse(n.generateExport(t,e,r)))}catch(e){return console.error(e),Promise.reject(`Could not create export JSON ${t}`)}},m=(e,t={},n={},r={})=>(t=l(),n=u(),r=d(),c(t,n,r,e));export{f as downloadHomagIxExportPoC,p as generateExportHomagIxConfiguration,m as homagIxMockUpData};