import { ReactNode } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";

export function Backup(): ReactNode {
  const { t } = useTranslation();
  const { records, exportRecords, importRecords, clearRecords } = useStore();

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{t("pages.backup.title")}</Typography>
      <Typography variant="body1">
        {t("pages.backup.count", {
          count: records.length,
          size:
            Math.round(
              (new TextEncoder().encode(JSON.stringify(records)).length /
                1024) *
                100
            ) / 100,
        })}
      </Typography>
      <Button onClick={exportRecords} variant="contained">
        {t("pages.backup.export")}
      </Button>
      <Button onClick={importRecords} color="warning" variant="contained">
        {t("pages.backup.restore")}
      </Button>
      <Button onClick={clearRecords} color="error" variant="contained">
        {t("pages.backup.clear")}
      </Button>
    </Stack>
  );
}
