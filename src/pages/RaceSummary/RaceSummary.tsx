import { ReactNode, useMemo } from "react";
import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";
import { RunRecord } from "@/entity";

function CardList({ records }: { records: RunRecord[] }): ReactNode {
  return records.map((record) => (
    <Card
      key={record.id}
      sx={{
        borderRadius: 0.5,
      }}
    >
      <CardContent
        sx={{
          p: 2,
          "&:last-child": {
            pb: 2,
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack alignItems="flex-start">
            <Typography>{record.date}</Typography>
            <Typography>{record.title}</Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography>{record.distance} km</Typography>
            <Typography>{record.raceTime ?? ""}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  ));
}

type RaceRecords = {
  upcoming: RunRecord[];
  past: RunRecord[];
};

export function RaceSummary(): ReactNode {
  const { records } = useStore();
  const { t } = useTranslation();

  const raceRecords: RaceRecords = useMemo(
    () =>
      records
        .filter((record) => record.isRace)
        .reduce<RaceRecords>(
          (pv, cv) => {
            return {
              upcoming: cv.isUpcoming ? [...pv.upcoming, cv] : pv.upcoming,
              past: !cv.isUpcoming ? [...pv.past, cv] : pv.past,
            };
          },
          {
            upcoming: [],
            past: [],
          }
        ),
    [records]
  );

  return (
    <Stack
      spacing={1}
      sx={{
        textAlign: "center",
        pt: 2,
      }}
    >
      <Typography variant="h6">
        {t("pages.raceSummary.upcomingRace")}
      </Typography>
      <CardList
        records={raceRecords.upcoming.sort(
          (a, b) => +new Date(a.date) - +new Date(b.date)
        )}
      />
      <Divider />
      <Typography variant="h6"> {t("pages.raceSummary.pastRace")}</Typography>
      <CardList
        records={raceRecords.past.sort(
          (a, b) => +new Date(b.date) - +new Date(a.date)
        )}
      />
    </Stack>
  );
}
