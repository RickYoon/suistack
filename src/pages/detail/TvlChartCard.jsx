import { DetailContext } from 'components/context/DetailContext';
import React, {useContext} from "react";
import * as Styled from "./TvlChartCard.style"
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    Area,
    Tooltip,
    CartesianGrid,
  } from "recharts";
  import Numeral from 'numeral'
  // import { GiLockedChest } from "react-icons/gi";
  import icons from "../../assets/tokenIcons"


function TvlChartcard(props) {

  const { detailinfo,isloading } = useContext(DetailContext);
    
    let data = []
    console.log("prop", props.chain)
    if(props.chain === "klaytn"){
      data = detailinfo.chartKlay
    } else if(props.chain === "wemix3.0"){
      data = detailinfo.chartWemix
    } else {
      data = detailinfo.chart
    }
    // const data = []

    const toK = (num) => {
      return Numeral(num).format('0.[00]a')
    }    

    const moneySymbol = "$"
    
    return (
    <>
        <Styled.Chartcover>
          <div style={{float:"right", fontSize:"15px", marginRight:"10px"}}>
            <Styled.Img src={icons["TVL"]} alt="logo" height="30px" width="30px" style={{ padding: "1px", verticalAlign: "middle", borderRadius: "15px" }} /> 
            <span style={{fontSize:"12px",marginLeft:"10px"}}>
              {props.chain === "klaytn" ? 
                <>Klaytn TVL</>
                :
                props.chain === "wemix3.0" ? 
                <>Wemix TVL</>
                :
                <>TVL</>
              }

                
            </span>
          </div>
            <ResponsiveContainer width="100%" height={250}>
                {isloading ? 
                    <><Styled.ProductSkeleton /></> :
                
                <AreaChart data={data}>
                    <defs>
                    <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
                        <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
                    </linearGradient>
                    </defs>

                    <Area dataKey="value" stroke="#2451B7" fill="url(#color)" />

                    <XAxis
                        tickLine={false}
                        axisLine={false}
                        interval="preserveEnd"
                        minTickGap={120}
                        dataKey="date"
                        stroke="#efefef"
                        tick={{ fontSize: 10, fill: '#000000' }}
                        tickFormatter={(str) => {
                            return str
                        }}
                    />

                    <YAxis
                        type="number"
                        orientation="left"
                        tickFormatter={(tick) => moneySymbol + toK(tick)}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveEnd"
                        dataKey="value"
                        minTickGap={80}
                        tickCount={8}
                        yAxisId={0}
                        mirror={true}
                        style={{ fontSize: "14px" }}
                        // domain={[detailinfo.minRef, detailinfo.maxRef]}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <CartesianGrid opacity={0.15} vertical={false} />
                </AreaChart>
                }
            </ResponsiveContainer>
        </Styled.Chartcover>
    </>
    );
}



function CustomTooltip({ active, payload, label }) {
  const toK = (num) => {
    return Numeral(num).format('0.[00]a')
  }    

  const moneySymbol = "$"

    if (active) {
      return (
        <Styled.StyleTooltip>
          <h4>{label}</h4>
          <p>{moneySymbol + toK((payload[0].value))}</p>
        </Styled.StyleTooltip>
      );
    }
    return null;
  }


export default TvlChartcard;
  