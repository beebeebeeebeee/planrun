import { Stack } from "@mui/material";
import { useCallback, useState } from "react";
import { PacingCalculator, PacingPaceList } from "@/pages";
import { DistanceUnit, PacingInfo } from "@/entity";

export const INIT_PAYLOAD = new PacingInfo({
  unit: DistanceUnit.KILOMETERS,
});

export function Pacing(): JSX.Element {
  const [payload, setPayload] = useState<PacingInfo>(INIT_PAYLOAD);

  const onClear = useCallback(() => {
    setPayload(INIT_PAYLOAD);
  }, []);

  return (
    <Stack spacing={1} textAlign="center" sx={{ my: 1 }}>
      <PacingCalculator
        payload={payload}
        setPayload={setPayload}
        onClear={onClear}
      />
      <PacingPaceList payload={payload} />
    </Stack>
  );
}
