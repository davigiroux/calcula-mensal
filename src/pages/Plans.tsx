import { useState } from "react";
import { PlansList } from "../components/PlansList";
import { mesesDoAno } from "../utils/dateHelpers";
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export function Plans() {
  const [mes, setMes] = useState<number>(new Date().getMonth());
  const [ano, setAno] = useState<number>(new Date().getFullYear());

  return (
    <Box>
      <Box display="flex" flexDirection="row" justifyContent="center" gap={2}>
        <FormControl>
          <InputLabel id="mes-label">Mês</InputLabel>
          <Select
            labelId="mes-label"
            label="Mês"
            name="mes"
            id="mes"
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            displayEmpty
          >
            {mesesDoAno.map((opcao, idx) => (
              <MenuItem key={idx} value={idx}>
                {opcao}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="ano-label">Ano</InputLabel>
          <Select
            labelId="ano-label"
            label="Ano"
            name="ano"
            id="ano"
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            displayEmpty
          >
            {Array.from(
              { length: 10 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Divider sx={{ marginY: 5 }} />
      <PlansList mes={mes} ano={ano} />
    </Box>
  );
}
