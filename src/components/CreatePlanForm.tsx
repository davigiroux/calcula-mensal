import {
  Control,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import supabase from "../utils/supabase";
import { useState } from "react";
import { diasDaSemana } from "../utils/dateHelpers";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";

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

  return (
    <>
      {fields.map((field, index) => (
        <Box key={field.id} borderRadius={1} padding={2}>
          <Typography variant="h6">#{index + 1}</Typography>
          <Grid2
            container
            flexDirection="row"
            alignContent="center"
            alignItems="center"
            spacing={2}
            justifyContent="space-between"
            marginTop={2}
          >
            <Grid2 size={{ md: 4, xs: 12 }}>
              <TextField
                sx={{ margin: 0 }}
                label="Valor"
                {...register(`items.${index}.valor`, { valueAsNumber: true })}
                type="number"
                margin="normal"
              />
            </Grid2>
            <Grid2 size={{ md: 4, xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel id="diaDaSemana">Dia da semana</InputLabel>
                <Select
                  labelId="diaDaSemana"
                  label="Dia da semana"
                  {...register(`items.${index}.diaDaSemana`)}
                >
                  {diasDaSemana.map((dia, idx) => (
                    <MenuItem key={idx} value={idx}>
                      {dia}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ md: 4, xs: 12 }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => remove(index)}
              >
                Remover
              </Button>
            </Grid2>
          </Grid2>
        </Box>
      ))}
      <Box margin="15px">
        <Button
          variant="outlined"
          onClick={() => append({ valor: 0, diaDaSemana: new Date().getDay() })}
        >
          Adicionar item
        </Button>
      </Box>
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
    <Container maxWidth="sm">
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
        <Typography variant="h6" gutterBottom>
          Nome do Plano
        </Typography>
        <TextField {...register("nome")} fullWidth margin="normal" />
        <Typography variant="h6" gutterBottom>
          Items do serviço
        </Typography>
        <PlanItemInputs control={control} register={register} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "16px" }}
          >
            Criar Plano
          </Button>
        </div>
        {formStatus !== null && (
          <Alert
            icon={<CheckCircleOutline fontSize="inherit" />}
            severity={formStatus}
            style={{ marginTop: "16px" }}
          >
            {resultMessage}
          </Alert>
        )}
      </form>
    </Container>
  );
};
