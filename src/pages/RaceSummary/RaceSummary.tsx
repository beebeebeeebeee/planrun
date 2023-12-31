import { ReactNode, useMemo } from "react";
import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";
import { RunRecord } from "@/entity";

function CardItem({ children }: { children: ReactNode }): ReactNode {
  return (
    <Card
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
        {children}
      </CardContent>
    </Card>
  );
}

function CardList({ records }: { records: RunRecord[] }): ReactNode {
  const { t } = useTranslation();

  if (records.length === 0)
    return <CardItem>{t("pages.raceSummary.noRecords")}</CardItem>;

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return records.map((record: RunRecord) => {
    const daysLeft = Math.floor(
      (new Date(record.date).getTime() - currentDate.getTime()) /
        (1000 * 3600 * 24)
    );
    return (
      <CardItem key={record.id}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack alignItems="flex-start">
            <Typography
              sx={(theme) => ({
                color: theme.palette.grey[600],
              })}
            >
              {/* eslint-disable-next-line no-nested-ternary */}
              {daysLeft > 0
                ? t("pages.raceSummary.daysLeft", { days: daysLeft })
                : daysLeft < 0
                ? t("pages.raceSummary.daysAgo", { days: -daysLeft })
                : t("pages.raceSummary.raceDay")}
            </Typography>
            <Typography>{record.date}</Typography>
            <Typography>{record.title}</Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography>{record.distance} km</Typography>
            <Typography>{record.raceTime ?? ""}</Typography>
          </Stack>
        </Stack>
      </CardItem>
    );
  });
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
