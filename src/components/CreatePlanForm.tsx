import {
  Control,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import supabase from "../utils/supabase";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Banner } from "./Banner";
import { diasDaSemana } from "../utils/dateHelpers";

type FormState = {
  items: PlanItem[];
  nome: string;
  formStatus?: "success" | "error";
  mensagemResultado?: string;
};

type PlanItem = {
  valor: number;
  diaDaSemana: number;
};

const initialState: FormState = {
  items: [{ valor: 0, diaDaSemana: new Date().getDay() }],
  nome: "",
  formStatus: undefined,
  mensagemResultado: undefined,
};

type PlanItemInputProps = {
  control: Control<FormState, unknown>;
  register: UseFormRegister<FormState>;
};

const PlanItemInputs = ({ control, register }: PlanItemInputProps) => {
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  console.log({ fields });

  return (
    <>
      {fields.map((field, index) => (
        <Fragment key={field.id}>
          <label htmlFor={`items.${index}.valor`}>
            Valor
            <input {...register(`items.${index}.valor`)} />
          </label>
          <br />
          <label htmlFor={`items.${index}.diaDaSemana`}>
            Dia da semana
            <select {...register(`items.${index}.diaDaSemana`)}>
              {diasDaSemana.map((dia, idx) => (
                <option value={idx}>{dia}</option>
              ))}
            </select>
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              margin: 0,
              padding: 0,
            }}
          >
            <button
              type="button"
              onClick={() => remove(index)}
              style={{ background: "#e34a4a" }}
            >
              Remover
            </button>
          </div>
          <hr />
        </Fragment>
      ))}
      <button
        type="button"
        style={{ width: "100%" }}
        onClick={() => append({ valor: 0, diaDaSemana: new Date().getDay() })}
      >
        Adicionar item
      </button>
    </>
  );
};

export const CreatePlanForm = () => {
  const [resultMessage, setResultMessage] = useState<string>();
  const [formStatus, setFormStatus] = useState<"success" | "error" | null>(
    null
  );
  const { register, control, handleSubmit, reset } = useForm<FormState>({
    defaultValues: initialState,
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(async (formData) => {
          const { error, data } = await supabase
            .from("plano")
            .insert({
              name: formData.nome,
              user_id: (await supabase.auth.getUser()).data.user?.id,
            })
            .select();

          if (error?.code) {
            setFormStatus("error");
            setResultMessage(`Erro ao criar plano: ${error.message}`);
            return;
          }

          if (!data) return;

          const planId = data[0].id;

          const { error: itemError } = await supabase.from("item_plano").insert(
            formData.items.map((item) => ({
              amount: item.valor,
              daysOfTheWeek: item.diaDaSemana,
              plano_id: planId,
            }))
          );

          if (itemError?.code) {
            setFormStatus("error");
            setResultMessage(
              `Erro ao criar item do plano: ${itemError.message}`
            );
            return;
          }

          reset();
          setFormStatus("success");
          setResultMessage("Plano criado com sucesso!");
        })}
      >
        <label style={{ marginLeft: 10 }}>Nome do Plano</label> <br />
        <input {...register("nome")} />
        <br />
        <h3>Items do serviço</h3>
        <PlanItemInputs control={control} register={register} />
        <br />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            style={{
              fontSize: "18px",
              backgroundColor: "#2196f3",
              marginTop: "64px",
            }}
          >
            Criar Plano
          </button>
        </div>
        <br />
        {formStatus !== null && (
          <Banner variant={formStatus}>{resultMessage}</Banner>
        )}
      </form>
    </>
  );
};
