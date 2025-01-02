import { useReducer } from "react";

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const diasDaSemana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

type FormState = {
  mes: number;
  ano: number;
  diaDaSemana: number;
  valor: number;
  total?: number;
};

type Action =
  | { type: "SET_MES"; payload: number }
  | { type: "SET_ANO"; payload: number }
  | { type: "SET_DIA_DA_SEMANA"; payload: number }
  | { type: "SET_VALOR"; payload: number }
  | { type: "CALCULAR" };

const initialState: FormState = {
  mes: new Date().getMonth(),
  ano: new Date().getFullYear(),
  diaDaSemana: 0,
  valor: 0,
  total: undefined,
};

const reducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case "SET_MES":
      return { ...state, mes: action.payload };
    case "SET_ANO":
      return { ...state, ano: action.payload };
    case "SET_DIA_DA_SEMANA":
      return { ...state, diaDaSemana: action.payload };
    case "SET_VALOR":
      return { ...state, valor: action.payload };
    case "CALCULAR": {
      const daysInMonth = new Date(state.ano, state.mes + 1, 0).getDate();
      let numberOfWeekDaysInMonth = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(state.ano, state.mes, day);
        if (date.getDay() === state.diaDaSemana) {
          numberOfWeekDaysInMonth++;
        }
      }

      const total = numberOfWeekDaysInMonth * state.valor;
      return { ...state, total };
    }
    default:
      return state;
  }
};

export const Form = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({ type: "CALCULAR" });
        }}
      >
        <label>
          Mês
          <select
            value={state.mes}
            onChange={(e) =>
              dispatch({ type: "SET_MES", payload: Number(e.target.value) })
            }
          >
            {meses.map((mes, idx) => (
              <option key={mes} value={idx}>
                {mes}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ano
          <input
            value={state.ano}
            type="number"
            min="1900"
            onChange={(e) =>
              dispatch({ type: "SET_ANO", payload: Number(e.target.value) })
            }
          />
        </label>
        <br />
        <label>
          Dia da semana
          <select
            value={state.diaDaSemana}
            onChange={(e) =>
              dispatch({
                type: "SET_DIA_DA_SEMANA",
                payload: Number(e.target.value),
              })
            }
          >
            {diasDaSemana.map((dia, idx) => (
              <option key={dia} value={idx}>
                {dia}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Valor
          <input
            value={state.valor}
            type="number"
            onChange={(e) =>
              dispatch({ type: "SET_VALOR", payload: Number(e.target.value) })
            }
          />
        </label>
        <br />
        <button type="submit">Calcular</button>
        <br />
        <br />
        {state.total && (
          <p>
            Total:{" "}
            {state.total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        )}
      </form>
    </>
  );
};
