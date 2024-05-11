
import React, { useState, useEffect } from 'react';
import axios from "axios";
import styled from "styled-components";
import { PoolContext } from "../../components/context/PoolContext"
import { Button, Modal,Image, List } from 'semantic-ui-react'
import ListTable from "./ListTable"
import icons from "../../assets/tokenIcons"
import Filterbox from "./Filterbox"
import RightBox from "./RightBox"

function KlayPool() {

  const [order, setOrder] = useState("tvl")
  const [stable, setStable] = useState(false)
  const [klay, setKlay] = useState(false)
  const [isloading,setIsloading] = useState(false)
  const [modal, setModal] = useState(false)
  const [aggtime, setAggtime] = useState("0000-00-00")
  const [filter, setFilter] = useState({
    project : "",
    token : "",
    type: "",
    order: "tvl"
  })
  
  const [backupPooldata, setBackupPooldata]= useState([])
  const [pooldata, setPooldata] = useState([{
    poolinfo : [],
    protocol:"",
    type: "",
    reward: [],
    tvl: 0,
    apr:0,
    aprDiff: 0,
    tvlDiff: 0,
    stableOnly: "no",
    klayOnly: "no",
    amount: 0
  }])

  useEffect(() => {
    loadPools()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // loadPools()
    console.log("filter changed")
    let tempState = backupPooldata

    if(filter.order === "apr"){
      console.log("here")
    // eslint-disable-next-line array-callback-return
    tempState.sort(function(a,b){
        if(a.apr < b.apr) return 1;
        if(a.apr === b.apr) return 0;
        if(a.apr > b.apr) return -1;
      })

      // setPooldata(tempaa)
    } else {
    // eslint-disable-next-line array-callback-return
    tempState.sort(function(a,b){
        if(a.tvl < b.tvl) return 1;
        if(a.tvl === b.tvl) return 0;
        if(a.tvl > b.tvl) return -1;
      })
    }

    if(filter.project === ""){
      tempState = tempState.filter(pool => pool )
      setPooldata(tempState)
    } else {
      if(filter.project === "KLAYportal"){
        tempState = tempState.filter(pool => pool.protocol === "hashquark" )
      } else if (filter.project === "Klaystation") {
        tempState = tempState.filter(pool => pool.protocol.split("-")[0] === "klaystation" )
      } else {
        tempState = tempState.filter(pool => pool.protocol === filter.project )
      }
      setPooldata(tempState)
    }

    if(filter.type === ""){
      tempState = tempState.filter(pool => pool )
      setPooldata(tempState)
    } else if (filter.type === "stableOnly"){
      tempState = tempState.filter(pool => pool.stableOnly === "yes" )
      setPooldata(tempState)
    } else if (filter.type === "klayOnly"){
      tempState = tempState.filter(pool => pool.klayOnly === "yes" )
      setPooldata(tempState)
    }

    if(filter.token === ""){
      tempState = tempState.filter(pool => pool )
      setPooldata(tempState)
    } else if (filter.token === "KLAY"){
      let tempArray = []
      let zeroCoin = tempState.filter(pool => pool.poolinfo[0] === "KLAY" )
      let oneCoin = tempState.filter(pool => pool.poolinfo[1] === "KLAY" )
      zeroCoin.forEach((res)=>{
        tempArray.push(res)
      })
      oneCoin.forEach((res)=>{
        tempArray.push(res)
      })
      setPooldata(tempArray)
    } else if (filter.token === "oUSDT"){
      let tempArray = []
      let zeroCoin = tempState.filter(pool => pool.poolinfo[0] === "oUSDT" )
      let oneCoin = tempState.filter(pool => pool.poolinfo[1] === "oUSDT" )
      let twoCoin = tempState.filter(pool => pool.poolinfo[2] === "oUSDT" )
      let threeCoin = tempState.filter(pool => pool.poolinfo[3] === "oUSDT" )
      zeroCoin.forEach((res)=>{
        tempArray.push(res)
      })
      oneCoin.forEach((res)=>{
        tempArray.push(res)
      })
      twoCoin.forEach((res)=>{
        tempArray.push(res)
      })
      threeCoin.forEach((res)=>{
        tempArray.push(res)
      })
      setPooldata(tempArray)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])


  const loadPools = async () => {
    setIsloading(true)
    // const url = "https://uv8kd7y3w5.execute-api.ap-northeast-2.amazonaws.com/production/getPoolList_v1"
    // const url = "https://uv8kd7y3w5.execute-api.ap-northeast-2.amazonaws.com/production/queryPoolList"
    const url = "https://uv8kd7y3w5.execute-api.ap-northeast-2.amazonaws.com/production/poollist_v2"

    await axios.get(url).then(function (response) {
      // console.log(response)

      let tempState = response.data.body.data.filter(pool => pool.klayOnly === "yes" )
      // setPooldata(tempState)
      // setKlay(!klay)


      setPooldata(tempState)
      setBackupPooldata(response.data.body.data)
      setAggtime(response.data.body.date)
      console.log(aggtime)
    })
    setIsloading(false)
  }

  const tvlSorting = () => {
    setOrder("tvl")
    // eslint-disable-next-line array-callback-return
    let tempState = pooldata.sort(function(a,b){
        if(a.tvl < b.tvl) return 1;
        if(a.tvl === b.tvl) return 0;
        if(a.tvl > b.tvl) return -1;
      })
      setPooldata(tempState)
      // console.log("tvl")
  }

  const aprSorting = () => {
    setOrder("apr")
    // eslint-disable-next-line array-callback-return
    let tempState = pooldata.sort(function(a,b){
        if(a.apr < b.apr) return 1;
        if(a.apr === b.apr) return 0;
        if(a.apr > b.apr) return -1;
      })
      setPooldata(tempState)
      // console.log("apr")
  }

  const stableSetter = () => {
    if(!stable){
      let tempState = pooldata.filter(pool => pool.protocol === "yes" )
      setPooldata(tempState)
      setStable(!stable)
    } else {
      setPooldata(backupPooldata)
      setStable(!stable)
    }
  }

  const klaySetter = () => {
    if(!klay){
      let tempState = pooldata.filter(pool => pool.klayOnly === "yes" )
      setPooldata(tempState)
      setKlay(!klay)
    } else {
      setPooldata(backupPooldata)
      setKlay(!klay)
    }
  }

  return (
    <>
      <PoolContext.Provider value={{pooldata, order,tvlSorting,aprSorting,stable, stableSetter,klay, klaySetter,isloading, filter, setFilter, aggtime}}>
        <ListTable />
      </PoolContext.Provider>
    </>
  );
}


const OverBox = styled.div`

  position: relative;
  width: calc(100% - (230px));
  width: -moz-calc(100% - (230px));
  width: -webkit-calc(100% - (230px));
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
  height: 100vh;
  overflow: auto;
  padding: 30px;

  @media screen and (max-width: 950px){
    /* width: 360px; */
    display: flex;
    flex-direction: column;
    margin-left: 0px;
    width: calc(100% );
    width: -moz-calc(100%);
    width: -webkit-calc(100%);
    padding: 0px;
    margin-Top: 10px;
  }
`


const Topbox = styled.div`
  width: 1136px;
  /* margin-left: 32px;
  margin-right: 32px; */
  margin: 0px auto;
  gap: 24px;
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 950px){
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`

const Leftcolumn = styled.div`
  width: 788px;
  /* background: gray; */
  @media screen and (max-width: 500px){
    width: 100%;
  }
`




export default KlayPool;
