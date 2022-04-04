import { createChart, CrosshairMode } from 'lightweight-charts';
import React, { useRef, useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useSwapContext, useTokenMap } from '@serum/swap-ui';
import moment from 'moment';
import { chart_api_key } from '../utils';

const Chart = () => {
  const { fromMint, toMint } = useSwapContext();
  const tokenMap = useTokenMap();
  const fromTokenInfo = tokenMap.get(fromMint.toString());
  const toTokenInfo = tokenMap.get(toMint.toString());

  const chart_pair_api = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${fromTokenInfo?.symbol}&tsym=${toTokenInfo?.symbol}&limit=1000&api_key=${chart_api_key}`;
  const chartContainerRef = useRef() as any;
  const chart = useRef() as any;

  useEffect(() => {
    chartContainerRef.current.children.length > 0
      ? chartContainerRef.current.children[0].remove()
      : null;
    chart.current = createChart(chartContainerRef.current, {
      width: 580,
      height: 400,
      layout: {
        backgroundColor: '#253248',
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: {
          color: '#334158',
        },
        horzLines: {
          color: '#334158',
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        borderColor: '#485c7b',
      },
    });
    const candles = chart.current.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    });
    const histogram = chart.current.addHistogramSeries({
      color: '#182233',
      lineWidth: 2,
      priceFormat: {
        type: 'volume',
      },
      overlay: true,
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    fetch(chart_pair_api)
      .then(response => response.json())
      .then(data => {
        const prepared = data?.Data?.Data?.map(({ time, low, high, open, close, volumefrom }) => {
          return {
            time: moment.unix(time).format('YYYY-MMM-DD'),
            low,
            high,
            open,
            close,
            value: volumefrom,
          };
        });
        candles.setData(prepared);
        histogram.setData(prepared);
        chart.timeScale().fitContent();
      })
      .catch(error => {
        console.error(error);
      });
  }, [fromMint, toMint]);

  return (
    <section>
      <div ref={chartContainerRef} className="chart-container" />
    </section>
  );
};

export { Chart };