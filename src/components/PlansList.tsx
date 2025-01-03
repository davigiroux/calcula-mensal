import { PostgrestError } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import {
  calculateNumberOfWeekDaysInMonth,
  calculateServiceAmount,
} from "../utils/calculator";
import { Tables } from "../utils/supabase.types";
import supabase from "../utils/supabase";
import { diasDaSemana } from "../utils/dateHelpers";

type Plan = Tables<"plano"> & { item_plano: Tables<"item_plano">[] };
type Props = {
  mes: number;
  ano: number;
};

export function PlansList({ mes, ano }: Props) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      const { data, error } = await supabase.from("plano").select(`
          *,
          item_plano (
            *
          )
        `);

      if (error) {
        setError(error);
        return;
      }

      if (!data) return;

      setPlans(data);
    }

    fetchPlans();
  }, []);

  const calculateTotalAmount = (plan: Plan) => {
    const totalAmount = plan.item_plano.reduce(
      (acc, curr) =>
        (acc += calculateServiceAmount(
          curr.amount,
          ano,
          mes,
          curr.daysOfTheWeek
        )),
      0
    );

    return totalAmount.toLocaleString("pt-Br", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getLongMonth = (date: Date) => {
    const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long" })
      .format;
    return monthName(date);
  };

  if (error) return <>{error.message}</>;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
      }}
    >
      {plans.map((plan) => {
        return (
          <div key={plan.id}>
            <h2 style={{ textDecoration: "underline" }}>{plan.name}</h2>
            <p>
              O total do plano será de:{" "}
              <strong>{calculateTotalAmount(plan)}</strong>
              <ul>
                {plan.item_plano.map((item) => (
                  <li>
                    O valor de{" "}
                    {item.amount.toLocaleString("pt-Br", {
                      style: "currency",
                      currency: "BRL",
                    })}{" "}
                    será cobrado{" "}
                    {calculateNumberOfWeekDaysInMonth(
                      ano,
                      mes,
                      item.daysOfTheWeek
                    )}{" "}
                    vezes(toda {diasDaSemana[item.daysOfTheWeek]}) no mês de{" "}
                    {getLongMonth(new Date(ano, mes, 1))}
                  </li>
                ))}
              </ul>
            </p>
          </div>
        );
      })}
    </div>
  );
}
