import { ReactNode, useCallback } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useConfirm } from "material-ui-confirm";
import { useStore } from "@/store";

export function Backup(): ReactNode {
  const { records, exportRecords, importRecords, clearRecords } = useStore();
  const { t } = useTranslation();
  const confirm = useConfirm();

  const restore = useCallback(async () => {
    try {
      await confirm({
        title: t("pages.backup.restoreConfirm.title"),
        description: t("pages.backup.restoreConfirm.description"),
        cancellationText: t("pages.backup.restoreConfirm.cancel"),
        cancellationButtonProps: {
          sx: (theme) => ({
            color: theme.palette.grey[500],
          }),
        },
        confirmationText: t("pages.backup.restoreConfirm.restore"),
        confirmationButtonProps: {
          color: "warning",
        },
      });
      importRecords();
    } catch (_) {
      return undefined;
    }
    return undefined;
  }, [importRecords]);

  const clear = useCallback(async () => {
    try {
      await confirm({
        title: t("pages.backup.clearConfirm.title"),
        description: t("pages.backup.clearConfirm.description"),
        cancellationText: t("pages.backup.clearConfirm.cancel"),
        cancellationButtonProps: {
          sx: (theme) => ({
            color: theme.palette.grey[500],
          }),
        },
        confirmationText: t("pages.backup.clearConfirm.clear"),
        confirmationButtonProps: {
          color: "error",
        },
      });
      clearRecords();
    } catch (_) {
      return undefined;
    }
    return undefined;
  }, [clearRecords]);

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
      <Button onClick={restore} color="warning" variant="contained">
        {t("pages.backup.restore")}
      </Button>
      <Button onClick={clear} color="error" variant="contained">
        {t("pages.backup.clear")}
      </Button>
    </Stack>
  );
}
