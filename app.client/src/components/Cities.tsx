/* src/pages/CitiesPage.tsx */
"use client";

import { CrudList } from "@/components/CrudList";
import { CitiesService } from "@/api/services/CitiesService";

/* ---- infer types directly from the service ---- */
type CityCreate = Parameters<typeof CitiesService.postApiVCities>[1];
type CityUpdate = Parameters<typeof CitiesService.putApiVCities>[1];
type CityItem = NonNullable<
  Awaited<ReturnType<typeof CitiesService.getCityList>>["data"]
>[number];

export default function CitiesPage() {
  return (
    <CrudList<CityCreate, CityUpdate, CityItem>
      config={{
        title: "Cities",
        fields: [
          { name: "name", label: "City Name", type: "text", required: true },
        ],

        /* OpenAPI handlers */
        getList: () => CitiesService.getCityList("1").then((r) => r.data ?? []),

        create: (d) => CitiesService.postApiVCities("1", d),

        update: (d) => CitiesService.putApiVCities("1", d),

        delete: (id: string) => CitiesService.deleteCity(id, "1"),
      }}
    />
  );
}
