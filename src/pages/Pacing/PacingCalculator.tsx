import React, { useCallback, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { Theme } from "@mui/material/styles/createTheme";
import { useTranslation } from "react-i18next";
import { DistanceUnit, PacingInfo } from "@/entity";
import { PacingUnitSwitch } from "@/pages";

const UNIT_FACTOR = 0.62137119;

const selectedColor = (theme: Theme) => ({
  borderRadius: 1,
  backgroundColor: theme.palette.grey[200],
});

const lockedColor = (theme: Theme) => ({
  borderRadius: 1,
  backgroundColor: theme.palette.primary.light,
});

export enum FieldConstant {
  DISTANCE,
  TIME,
  PACING,
}

interface CalculatorProps {
  payload: PacingInfo;
  setPayload: React.Dispatch<React.SetStateAction<PacingInfo>>;
  onClear: () => void;
}

export function PacingCalculator(props: CalculatorProps): JSX.Element {
  const { t } = useTranslation();

  const { payload, setPayload, onClear } = props;
  const [calculated, setCalculated] = useState<FieldConstant>();
  const [locked, setLocked] = useState<FieldConstant>();

  const setUnit = useCallback(
    (unit: DistanceUnit): void => {
      let { distance, pacing } = payload;

      switch (unit) {
        case DistanceUnit.KILOMETERS: {
          if (distance !== undefined) {
            distance /= UNIT_FACTOR;
          }
          if (pacing !== undefined) {
            pacing /= UNIT_FACTOR;
          }
          break;
        }
        case DistanceUnit.MILES: {
          if (distance !== undefined) {
            distance *= UNIT_FACTOR;
          }
          if (pacing !== undefined) {
            pacing *= UNIT_FACTOR;
          }
          break;
        }
      }

      setPayload((p) =>
        p
          .withUpdate({
            name: "unit",
            value: unit,
          })
          .withUpdate({
            name: "pacing",
            value: pacing,
          })
          .withUpdate({
            name: "distance",
            value: distance,
          })
      );
    },
    [payload]
  );

  const calculateDistance = useCallback((targetPayload: PacingInfo): void => {
    const { time, pacing } = targetPayload;

    const newDistance = Math.round((time! / pacing!) * 1000) / 1000;
    setPayload((p) =>
      p.withUpdate({
        name: "distance",
        value: newDistance,
      })
    );
    setCalculated(FieldConstant.DISTANCE);
  }, []);

  const calculateTime = useCallback((targetPayload: PacingInfo): void => {
    const { distance, pacing } = targetPayload;

    const newTime = Math.round(distance! * pacing!);
    setPayload((p) =>
      p.withUpdate({
        name: "time",
        value: newTime,
      })
    );
    setCalculated(FieldConstant.TIME);
  }, []);

  const calculatePacing = useCallback((targetPayload: PacingInfo): void => {
    const { distance, time } = targetPayload;

    const newPacing = Math.round(time! / distance!);
    setPayload((p) =>
      p.withUpdate({
        name: "pacing",
        value: newPacing,
      })
    );
    setCalculated(FieldConstant.PACING);
  }, []);

  const calculateRouter = useCallback(
    (
      trigger: FieldConstant,
      _field: FieldConstant,
      targetPayload: PacingInfo
    ): void => {
      console.log(trigger, locked);
      let field: FieldConstant;
      if (locked !== _field) {
        field = _field;
      } else {
        switch (locked) {
          case FieldConstant.DISTANCE: {
            field =
              trigger !== FieldConstant.TIME
                ? FieldConstant.TIME
                : FieldConstant.PACING;
            break;
          }
          case FieldConstant.TIME: {
            field =
              trigger !== FieldConstant.DISTANCE
                ? FieldConstant.DISTANCE
                : FieldConstant.PACING;
            break;
          }
          case FieldConstant.PACING: {
            field =
              trigger !== FieldConstant.DISTANCE
                ? FieldConstant.DISTANCE
                : FieldConstant.TIME;
            break;
          }
        }
      }
      switch (field) {
        case FieldConstant.DISTANCE: {
          calculateDistance(targetPayload);
          break;
        }
        case FieldConstant.TIME: {
          calculateTime(targetPayload);
          break;
        }
        case FieldConstant.PACING: {
          calculatePacing(targetPayload);
          break;
        }
      }
    },
    [locked, calculateDistance, calculateTime, calculatePacing]
  );

  const calculate = useCallback(
    (trigger: FieldConstant, targetPayload: PacingInfo): void => {
      const { distance, time, pacing } = targetPayload;
      setPayload(targetPayload);

      if ([distance, time, pacing].filter((e) => e !== undefined).length < 2)
        return;

      switch (trigger) {
        case FieldConstant.DISTANCE: {
          if (calculated !== undefined && calculated !== trigger) {
            calculateRouter(trigger, calculated, targetPayload);
            break;
          }
          switch (true) {
            case time !== undefined &&
              (pacing === undefined || locked !== FieldConstant.PACING): {
              calculatePacing(targetPayload);
              break;
            }
            case pacing !== undefined &&
              (time === undefined || locked !== FieldConstant.TIME): {
              calculateTime(targetPayload);
              break;
            }
          }
          break;
        }
        case FieldConstant.TIME: {
          if (calculated !== undefined && calculated !== trigger) {
            calculateRouter(trigger, calculated, targetPayload);
            break;
          }
          switch (true) {
            case distance !== undefined &&
              (pacing === undefined || locked !== FieldConstant.PACING): {
              calculatePacing(targetPayload);
              break;
            }
            case pacing !== undefined &&
              (distance === undefined || locked !== FieldConstant.DISTANCE): {
              calculateDistance(targetPayload);
              break;
            }
          }
          break;
        }
        case FieldConstant.PACING: {
          if (calculated !== undefined && calculated !== trigger) {
            calculateRouter(trigger, calculated, targetPayload);
            break;
          }
          switch (true) {
            case distance !== undefined &&
              (time === undefined || locked !== FieldConstant.TIME): {
              calculateTime(targetPayload);
              break;
            }
            case time !== undefined &&
              (distance === undefined || locked !== FieldConstant.DISTANCE): {
              calculateDistance(targetPayload);
              break;
            }
          }
          break;
        }
      }
    },
    [
      locked,
      calculated,
      calculateRouter,
      calculateDistance,
      calculateTime,
      calculatePacing,
    ]
  );

  const setDistance = useCallback(
    (distance: number): void => {
      calculate(
        FieldConstant.DISTANCE,
        payload.withUpdate({ name: "distance", value: distance })
      );
    },
    [calculate, payload]
  );

  const setTime = useCallback(
    ({ h, m, s }: Partial<Record<"h" | "m" | "s", number>>): void => {
      if (
        [h, m, s].find(
          (e) => e !== undefined && (e.toString().includes(".") || e < 0)
        ) !== undefined
      )
        return;

      let targetTime: number;

      switch (true) {
        case h !== undefined: {
          targetTime =
            (payload?.time ?? 0) +
            (h! - Math.floor((payload?.time ?? 0) / 60 / 60)) * 60 * 60;
          break;
        }
        case m !== undefined: {
          targetTime =
            (payload?.time ?? 0) +
            (m! - Math.floor(((payload?.time ?? 0) % (60 * 60)) / 60)) * 60;
          break;
        }
        case s !== undefined: {
          targetTime =
            (payload?.time ?? 0) + (s! - Math.floor((payload?.time ?? 0) % 60));
          break;
        }
      }

      calculate(
        FieldConstant.TIME,
        payload.withUpdate({ name: "time", value: targetTime! })
      );
    },
    [payload, calculate]
  );

  const setPacing = useCallback(
    ({ m, s }: Partial<Record<"m" | "s", number>>): void => {
      if (
        [m, s].find(
          (e) => e !== undefined && (e.toString().includes(".") || e < 0)
        ) !== undefined
      )
        return;

      let targetPacing: number;

      switch (true) {
        case m !== undefined: {
          targetPacing =
            (payload?.pacing ?? 0) +
            (m! - Math.floor((payload?.pacing ?? 0) / 60)) * 60;
          break;
        }
        case s !== undefined: {
          targetPacing =
            (payload?.pacing ?? 0) +
            (s! - Math.floor((payload?.pacing ?? 0) % 60));
          break;
        }
      }

      calculate(
        FieldConstant.PACING,
        payload.withUpdate({ name: "pacing", value: targetPacing! })
      );
    },
    [payload, calculate]
  );

  const clear = useCallback((): void => {
    onClear();
    setCalculated(undefined);
  }, []);

  return (
    <Card sx={{ my: 2, textAlign: "left" }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Button variant="text" size="small" onClick={clear}>
              {t("pages.pacing.clear")}
            </Button>
            <FormControlLabel
              control={
                <PacingUnitSwitch
                  checked={payload.unit === DistanceUnit.MILES}
                  onChange={(event) => {
                    setUnit(
                      event.target.checked
                        ? DistanceUnit.MILES
                        : DistanceUnit.KILOMETERS
                    );
                  }}
                />
              }
              label={t("pages.pacing.unit")}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography>
              <b>{t("pages.pacing.distance")}</b>{" "}
              {t(`unit.inDistance.${payload.unit}`)}
            </Typography>
            <TextField
              label={t(`unit.distanceFull.${payload.unit}`)}
              size="small"
              type="number"
              sx={
                locked === FieldConstant.DISTANCE
                  ? selectedColor
                  : calculated === FieldConstant.DISTANCE
                  ? lockedColor
                  : {}
              }
              value={(payload.distance?.toString() ?? "") as any}
              onChange={(event) => {
                const { value } = event.target;
                if (value === "" || value === "0") return;
                setDistance(Number(value));
              }}
              fullWidth
            />
          </Stack>
          <Stack spacing={1}>
            <Typography>
              <b>{t("pages.pacing.time")}</b>
            </Typography>
            <Stack direction="row" justifyContent="space-evenly" spacing={1}>
              <TextField
                label={t("unit.time.hours")}
                size="small"
                type="number"
                sx={
                  locked === FieldConstant.TIME
                    ? selectedColor
                    : calculated === FieldConstant.TIME
                    ? lockedColor
                    : {}
                }
                value={
                  payload.time != null
                    ? Math.floor(payload.time / 60 / 60).toString()
                    : ""
                }
                onChange={(event) => {
                  setTime({ h: Number(event.target.value) });
                }}
                fullWidth
              />
              <TextField
                label={t("unit.time.minutes")}
                size="small"
                type="number"
                sx={
                  locked === FieldConstant.TIME
                    ? selectedColor
                    : calculated === FieldConstant.TIME
                    ? lockedColor
                    : {}
                }
                value={
                  payload.time != null
                    ? Math.floor((payload.time % (60 * 60)) / 60).toString()
                    : ""
                }
                onChange={(event) => {
                  setTime({ m: Number(event.target.value) });
                }}
                fullWidth
              />
              <TextField
                label={t("unit.time.seconds")}
                size="small"
                type="number"
                sx={
                  locked === FieldConstant.TIME
                    ? selectedColor
                    : calculated === FieldConstant.TIME
                    ? lockedColor
                    : {}
                }
                value={
                  payload.time != null
                    ? Math.floor(payload.time % 60).toString()
                    : ""
                }
                onChange={(event) => {
                  setTime({ s: Number(event.target.value) });
                }}
                fullWidth
              />
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography>
              <b>{t("pages.pacing.pace")}</b>
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-evenly"
              spacing={1}
              alignItems="center"
            >
              <TextField
                label={t("unit.time.minutes")}
                size="small"
                type="number"
                sx={
                  locked === FieldConstant.PACING
                    ? selectedColor
                    : calculated === FieldConstant.PACING
                    ? lockedColor
                    : {}
                }
                value={
                  payload.pacing != null
                    ? Math.floor(payload.pacing / 60).toString()
                    : ""
                }
                onChange={(event) => {
                  setPacing({ m: Number(event.target.value) });
                }}
                fullWidth
              />
              <TextField
                label={t("unit.time.seconds")}
                size="small"
                type="number"
                sx={
                  locked === FieldConstant.PACING
                    ? selectedColor
                    : calculated === FieldConstant.PACING
                    ? lockedColor
                    : {}
                }
                value={
                  payload.pacing != null
                    ? Math.floor(payload.pacing % 60).toString()
                    : ""
                }
                onChange={(event) => {
                  setPacing({ s: Number(event.target.value) });
                }}
                fullWidth
              />
              <Typography
                sx={{
                  width: "100%",
                }}
              >
                /{t(`unit.distanceFull.${payload.unit}`)}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ pt: 3 }}
            direction="row"
            spacing={2}
          >
            <LockIcon color="primary" />
            <ButtonGroup variant="outlined">
              <Button
                variant={
                  locked === FieldConstant.DISTANCE ? "contained" : "outlined"
                }
                onClick={() => {
                  setLocked((l) =>
                    l !== FieldConstant.DISTANCE
                      ? FieldConstant.DISTANCE
                      : undefined
                  );
                }}
              >
                {t("pages.pacing.distance")}
              </Button>
              <Button
                variant={
                  locked === FieldConstant.TIME ? "contained" : "outlined"
                }
                onClick={() => {
                  setLocked((l) =>
                    l !== FieldConstant.TIME ? FieldConstant.TIME : undefined
                  );
                }}
              >
                {t("pages.pacing.time")}
              </Button>
              <Button
                variant={
                  locked === FieldConstant.PACING ? "contained" : "outlined"
                }
                onClick={() => {
                  setLocked((l) =>
                    l !== FieldConstant.PACING
                      ? FieldConstant.PACING
                      : undefined
                  );
                }}
              >
                {t("pages.pacing.pace")}
              </Button>
            </ButtonGroup>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
