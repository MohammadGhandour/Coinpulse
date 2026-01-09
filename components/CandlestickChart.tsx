'use client';

import { getCandlestickConfig, getChartConfig, PERIOD_BUTTONS, PERIOD_CONFIG } from "@/constants";
import { fetcher } from "@/lib/coingecko.actions";
import { cn, convertOHLCData } from "@/lib/utils";
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from "lightweight-charts";
import { useEffect, useRef, useState, useTransition } from "react";

export default function CandlestickChart({
  children,
  data,
  coinId,
  height = 360,
  initialPeriod = "daily"
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const canldeSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
  const [isPending, startTransition] = useTransition();

  const fetchOHLCData = async (selectedPeriod: Period) => {
    try {
      const { days, interval } = PERIOD_CONFIG[selectedPeriod];
      const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: "usd",
        days,
        // interval,
        precision: "full"
      });

      setOhlcData(newData ?? []);
    } catch (error) {
      console.error("Failed to fetch OHLCData", error);
    }
  };

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;
    startTransition(async () => {
      setPeriod(newPeriod);
      await fetchOHLCData(newPeriod);
    })
  };

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const showTime = ["daily", "weekly", "monthly"].includes(period);

    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    });

    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    series.setData(convertOHLCData(ohlcData));
    chart.timeScale().fitContent();

    chartRef.current = chart;
    canldeSeriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      canldeSeriesRef.current = null;
    };
  }, [height]);

  useEffect(() => {
    if (!canldeSeriesRef.current) return;

    const convertedToSeconds = ohlcData.map(item =>
      [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData
    );
    const converted = convertOHLCData(convertedToSeconds);
    canldeSeriesRef.current.setData(converted);
    chartRef.current?.timeScale().fitContent();
  }, [ohlcData, period]);

  return (
    <div id="candlestick-chart">
      <div className="chart-header">
        <div className="flex-1">{children}</div>

        <div className="button-group">
          <span className="text-sm px-2 font-medium text-purple-100/50">Period:</span>
          {PERIOD_BUTTONS.map(({ value, label }) => {
            const active = value === period;
            return (
              <button
                key={value}
                className={cn(active ? "config-button-active" : "config-button")}
                onClick={() => handlePeriodChange(value)}
                disabled={loading}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div ref={chartContainerRef} className="chart" style={{ height }} />
    </div>
  )
};