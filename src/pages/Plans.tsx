import { useState } from "react";
import { PlansList } from "../components/PlansList";
import { mesesDoAno } from "../utils/dateHelpers";

export function Plans() {
  const [mes, setMes] = useState<number>(new Date().getMonth());
  const [ano, setAno] = useState<number>(new Date().getFullYear());

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <div>
          <label htmlFor="mes">
            Mês
            <select
              name="mes"
              id="mes"
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
            >
              {mesesDoAno.map((opcao, idx) => (
                <option value={idx}>{opcao}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="ano">
            Ano
            <input
              type="number"
              name="ano"
              id="ano"
              value={ano}
              onChange={(e) => setAno(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
      <PlansList mes={mes} ano={ano} />
    </div>
  );
}
