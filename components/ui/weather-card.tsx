import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

interface WeatherData {
  city: string;

  current: {
    temperature_2m: number;
    wind_speed_10m: number;
  };

  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Weather in {data.city}</CardTitle>
        <p className="text-sm text-muted-foreground">Current Weather</p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <p className="text-5xl font-semibold">
            {data.current.temperature_2m}°C
          </p>

          <p className="text-sm text-muted-foreground mt-2">
            Wind Speed: {data.current.wind_speed_10m} km/h
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-3">7-Day Forecast</h3>

          <div className="space-y-3">
            {data.daily.time.map((date, index) => (
              <div
                key={date}
                className="flex justify-between text-sm border-b pb-2"
              >
                <span>{date}</span>

                <span>
                  {data.daily.temperature_2m_max[index]}° /{" "}
                  {data.daily.temperature_2m_min[index]}°
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>

      <CardContent className="space-y-4">
        <Skeleton className="h-12 w-28" />

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}

export function ErrorCard({ msg }: { msg: string }) {
  return (
    <Card className="w-full max-w-md border-red-300">
      <CardHeader>
        <CardTitle className="text-red-600">Weather Error</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{msg}</p>
      </CardContent>
    </Card>
  );
}
