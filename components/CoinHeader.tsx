import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Badge } from "./ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
export default function CoinHeader({
  livePriceChangePercentage24h,
  priceChangePercentage30d,
  name,
  image,
  livePrice,
  priceChange24h
}: LiveCoinHeaderProps) {
  const isTrendingUp = livePriceChangePercentage24h > 0;
  const isThirtyDayUp = priceChangePercentage30d > 0;
  const isPriceChangeUp = priceChange24h > 0;

  const stats = [
    {
      label: "Today",
      value: livePriceChangePercentage24h,
      isUp: isTrendingUp,
      formatter: formatPercentage,
      showIcon: true
    },
    {
      label: "30 Days",
      value: priceChangePercentage30d,
      isUp: isThirtyDayUp,
      formatter: formatPercentage,
      showIcon: true
    },
    {
      label: "Price Change (24h)",
      value: priceChange24h,
      isUp: isPriceChangeUp,
      formatter: formatCurrency,
      showIcon: false
    }
  ];

  return (
    <div id="coin-header">
      <h3>{name}</h3>

      <div className="info">
        <Image src={image} alt={name} width={77} height={77} />

        <div className="price-row">
          <h1>{formatCurrency(livePrice)}</h1>
          <Badge className={cn("badge", isTrendingUp ? "badge-up" : "badge-down")}>
            {formatPercentage(livePriceChangePercentage24h)}
            {isTrendingUp ? <TrendingUp /> : <TrendingDown />}
            (24h)
          </Badge>
        </div>
      </div>

      <ul className="stats">
        {stats.map(({ label, value, formatter, isUp, showIcon }) => (
          <li key={label}>
            <p className="label">{label}</p>

            <div
              className={cn("value", {
                "text-green-500": isUp,
                "text-red-500": !isUp
              })}
            >
              <p>{formatter(value)}</p>
              {showIcon && (isUp ? <TrendingUp width={16} height={16} /> : <TrendingDown width={16} height={16} />)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
};