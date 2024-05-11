import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import { DetailContext } from "../../components/context/DetailContext"
import { getDetailData } from 'apis/detail';
import * as Styled from "./Detail.style"

import TopTitle from './TopTitle';
import TopNumberCard from './TopNumberCard'
import TvlChartCard from "./TvlChartCard"
import TokenChartcard from "./TokenChartCard"
import TokenChartCardMulti from "./TokenChartCardMulti"
import RightBox from "./RightBox"
// import TokenTable from "./TokenTable"

import { Link } from "react-router-dom";
import { BsBoxArrowLeft } from "react-icons/bs";


function Detail() {

    const { id } = useParams();
    const [isloading, setIsloading] = useState(false)
    const [detailinfo, setDetailinfo] = useState({
      "chart": [{
        date: "07-01",
        tvl: 0
      }],
      "chartKlay": [{
        date: "07-01",
        tvl: 0
      }],
      "chartWemix": [{
        date: "07-01",
        tvl: 0
      }],
      "proj": {
        twitterid: ""
      },
      "vacancyCounter": 0,
      "lastTvl": 0,
      "oneDayChangeValue": 0,
      "oneDayChangePercent": 0,
      "rankInfo": {
        myRank : 0,
        Prev : "",
        Next : ""
      },
      "price": []
    });
  

    useEffect(() => {
        loadchart(id)
    }, [])

    const loadchart = async (id) => {

        setIsloading(true)

        await getDetailData(id).then(function (response){

          let tempArr = [];
          let maxArr = [];

          let tempArrKlay = [];
          let maxArrKlay = [];

          let tempArrWemix = [];
          let maxArrWemix = [];

          let priceArr = [];
          let priceArrTwo = [];
          let rankList = {
            myRank : 0,
            Prev : "",
            Next : ""
          };
          let sortArr = [];

          console.log("response", response.chart.Items[0])

          const sortable = Object.entries(response.chart.Items[0])

          sortable.forEach((table)=>{
            if(table[0] !=="date"){
              table[0] !=="dataType" ? 
              sortArr.push({
                projName: table[0],
                tvl: table[1]
              }) :
              <></> 
            }
          })

          sortArr = mergeAndFilterKurrency(sortArr)

          sortArr.sort(function (a, b) {
            return a.tvl > b.tvl ? -1 : a.tvl < b.tvl ? 1 : 0;
          })

          sortArr = sortArr.filter(dat => dat.projName !== "KCT-Total")

          console.log("sortArr", sortArr)

          rankList.myRank = sortArr.findIndex(i => i.projName === id)
          rankList.myRank === 0 ? rankList.Prev = "" : rankList.Prev = sortArr[rankList.myRank - 1].projName
          rankList.myRank === sortArr.length-1 ? rankList.Next = "end" : rankList.Next = sortArr[rankList.myRank + 1].projName


          let transId = id;

          if(transId === "Kurrency"){
            transId = "kurrency-WCD"

            response.chart.Items.forEach((item) => {
              if(Number(item[transId])>0){
              tempArr.push({
                date: item.date.slice(2, 10),
                value: Number(item["kurrency-WCD"])+Number(item["kurrency-KCD"]),
              })
              maxArr.push({
                value:  Number(item["kurrency-WCD"])+Number(item["kurrency-KCD"]),
              })
              tempArrKlay.push({
                date: item.date.slice(2, 10),
                value: Number(item["kurrency-KCD"]),
              })
              maxArrKlay.push({
                value:  Number(item["kurrency-KCD"]),
              })
              tempArrWemix.push({
                date: item.date.slice(2, 10),
                value: Number(item["kurrency-WCD"]),
              })
              maxArrWemix.push({
                value:  Number(item["kurrency-WCD"]),
              })
              
            }
            })
  
            tempArr.sort(function (a, b) {
              return a.date < b.date ? -1 : a.date < b.date ? 1 : 0;
            })
  
            maxArr.sort(function (a, b) {
              return a.value > b.value ? -1 : a.value > b.value ? 1 : 0;
            })

            tempArrKlay.sort(function (a, b) {
              return a.date < b.date ? -1 : a.date < b.date ? 1 : 0;
            })
  
            maxArrKlay.sort(function (a, b) {
              return a.value > b.value ? -1 : a.value > b.value ? 1 : 0;
            })

            tempArrWemix.sort(function (a, b) {
              return a.date < b.date ? -1 : a.date < b.date ? 1 : 0;
            })
  
            maxArrWemix.sort(function (a, b) {
              return a.value > b.value ? -1 : a.value > b.value ? 1 : 0;
            })

            // console.log("response,price", response.price)
  
            response.price.forEach((item) => {
                if (item.price > 1) {
                  priceArr.push({
                    date: item.date.slice(2, 10),
                    dateRaw: item.date,
                    value: Number(item.multiObject[0].tokenPrice.toFixed(1))
                  })
                  if(item.multiObject.length === 2){
                  priceArrTwo.push({
                    date: item.date.slice(2, 10),
                    dateRaw: item.date,
                    value: Number(item.multiObject[1].tokenPrice.toFixed(1))
                  })
                  }
                } else {
                  priceArr.push({
                    date: item.date.slice(2, 10),
                    dateRaw: item.date,
                    value: Number(item.multiObject[0].tokenPrice.toFixed(5))
                  })
                  if(item.multiObject.length === 2){
                  priceArrTwo.push({
                    date: item.date.slice(2, 10),
                    dateRaw: item.date,
                    value: Number(item.multiObject[1].tokenPrice.toFixed(1))
                  })
                }
                }
              
            })
            
  
            priceArr.sort(function(a,b){
              return a.date < b.date ? -1 : a.date < b.date ? 1 : 0;
            })
            priceArrTwo.sort(function(a,b){
              return a.date < b.date ? -1 : a.date < b.date ? 1 : 0;
            })
  
            let serviceObject = {
              "chart": tempArr,
              "maxRef": maxArr[0].value * 1.1,
              "minRef": maxArr[maxArr.length-1].value * 0.9,
              "chartKlay": tempArrKlay,
              "maxRefKlay": maxArrKlay[0].value * 1.1,
              "minRefKlay": maxArrKlay[maxArrKlay.length-1].value * 0.9,
              "chartWemix": tempArrWemix,
              "maxRefWemix": maxArrWemix[0].value * 1.1,
              "minRefWemix": maxArrWemix[maxArrWemix.length-1].value * 0.9,
              "price": priceArr,
              "chartLength": tempArr.length,
              "priceLength": priceArr.length,
              "priceTwo": priceArrTwo,
              "lastTvl": Number(response.chart.Items[0]["kurrency-WCD"].toFixed(0))+Number(response.chart.Items[0]["kurrency-KCD"].toFixed(0)),
              "proj": response.proj,
              "tokenList": response.tokenList,
              "vacancyCounter": response.numberOfPricedays,
              "oneDayChangeValue": (response.chart.Items[0]["kurrency-WCD"]+response.chart.Items[0]["kurrency-KCD"])-(response.chart.Items[1]["kurrency-WCD"]+response.chart.Items[1]["kurrency-KCD"]),
              "oneDayChangePercent": (((response.chart.Items[0]["kurrency-WCD"]+response.chart.Items[0]["kurrency-KCD"])-(response.chart.Items[1]["kurrency-WCD"]+response.chart.Items[1]["kurrency-KCD"]))/(response.chart.Items[1]["kurrency-WCD"]+response.chart.Items[1]["kurrency-KCD"]))*100,
              "rankInfo":rankList
            }
  
            setDetailinfo(serviceObject)
            
          } else {

            response.chart.Items.forEach((item) => {
              if(Number(item[transId])>0){
              tempArr.push({
                date: item.date.slice(2, 10),
                value: Number(item[transId]),
              })
              maxArr.push({
                value: Number(item[transId]),
              })
            }
            })
  
            tempArr.sort(function (a, b) {
              return a.date < b.date ? -1 : a.date < b.date ? 1 : 0;
            })
  
            maxArr.sort(function (a, b) {
              return a.value > b.value ? -1 : a.value > b.value ? 1 : 0;
            })
  
            response.price.forEach((item) => {
                if (item.price > 1) {
                  priceArr.push({
                    date: item.date.slice(2, 10),
                    dateRaw: item.date,
                    value: Number(item.multiObject[0].tokenPrice.toFixed(1))
                  })
                  if(item.multiObject.length === 2){
                  priceArrTwo.push({
                    date: item.date.slice(2, 10),
                    dateRaw: item.date,
                    value: Number(item.multiObject[1].tokenPrice.toFixed(1))
                  })
                  }
                } else {
                  priceArr.push({
                    date: item.date.slice(2, 10),
                    dateRaw: item.date,
                    value: Number(item.multiObject[0].tokenPrice.toFixed(5))
                  })
                  if(item.multiObject.length === 2){
                  priceArrTwo.push({
                    date: item.date.slice(2, 10),
                    dateRaw: item.date,
                    value: Number(item.multiObject[1].tokenPrice.toFixed(1))
                  })
                }
                }
              
            })
            
  
            priceArr.sort(function(a,b){
              return a.date < b.date ? -1 : a.date < b.date ? 1 : 0;
            })
            priceArrTwo.sort(function(a,b){
              return a.date < b.date ? -1 : a.date < b.date ? 1 : 0;
            })
  
            let serviceObject = {
              "chart": tempArr,
              "maxRef": maxArr[0].value * 1.1,
              "minRef": maxArr[maxArr.length-1].value * 0.9,
              "price": priceArr,
              "chartLength": tempArr.length,
              "priceLength": priceArr.length,
              "priceTwo": priceArrTwo,
              "lastTvl": Number(response.chart.Items[0][transId].toFixed(0)),
              "proj": response.proj,
              "tokenList": response.tokenList,
              "vacancyCounter": response.numberOfPricedays,
              "oneDayChangeValue": response.chart.Items[0][transId]-response.chart.Items[1][transId],
              "oneDayChangePercent": ((response.chart.Items[0][transId]-response.chart.Items[1][transId])/response.chart.Items[0][transId])*100,
              "rankInfo":rankList
            }
  
            setDetailinfo(serviceObject)
            
          }          



        })

        setIsloading(false)

    
    }


  return (
    <>
        <DetailContext.Provider value={{detailinfo, isloading}}>
        <Styled.OverBox>
            <Styled.SubTopNavBlock style={{ marginBottom: "30px", fontSize: "17px" }}>
            <Link to="/">
                    <BsBoxArrowLeft style={{ marginRight: "10px", verticalAlign: "middle" }}/>
                    Back to List
            </Link>
            </Styled.SubTopNavBlock>
          <Styled.Topbox>
            <Styled.Leftcolumn>              
              <TopTitle/>
              <TopNumberCard />
              <TvlChartCard />
              
              {id === "Kurrency" ?
              <>
              <TvlChartCard chain="klaytn"/>
              <TvlChartCard chain="wemix3.0"/>
              </>
              :
              <></>
              }

              {detailinfo.proj.tokenNumber === 2 ?
                <>
                  <TokenChartCardMulti pageInfo={id} refNumber={1} /> 
                  <TokenChartCardMulti pageInfo={id} refNumber={2}/> 
                </>
                : detailinfo.proj.tokenNumber === 0 ?
                <></> :
                <TokenChartcard pageInfo={id} />
              }
              {/* <TokenTable /> */}
            </Styled.Leftcolumn>
            <Styled.Rightcolumn>
                <RightBox />
            </Styled.Rightcolumn>
          </Styled.Topbox>
          </Styled.OverBox>
        </DetailContext.Provider>
    </>
  );
}


function mergeAndFilterKurrency(arr) {
  const result = [];

  // 사용자 정의 함수: projName이 "kurrency-KCD" 또는 "kurrency-WCD"일 때 true 반환
  function isKurrency(item) {
      return item.projName === "kurrency-KCD" || item.projName === "kurrency-WCD";
  }

  // kurrency-KCD와 kurrency-WCD의 tvl 값을 합치기
  const kurrencyTvl = arr
      .filter(isKurrency)
      .reduce((acc, item) => acc + item.tvl, 0);

  // 합쳐진 값을 새로운 객체로 만들어서 결과 배열에 추가
  result.push({ projName: "Kurrency", tvl: kurrencyTvl });

  // kurrency-KCD와 kurrency-WCD를 제외한 다른 객체들 추가
  result.push(...arr.filter(item => !isKurrency(item)));

  return result;
}


export default Detail;