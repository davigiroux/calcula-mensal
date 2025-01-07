import { PostgrestError } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import {
  calculateNumberOfWeekDaysInMonth,
  calculateServiceAmount,
} from "../utils/calculator";
import { Tables } from "../utils/supabase.types";
import supabase from "../utils/supabase";
import { diasDaSemana } from "../utils/dateHelpers";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid2,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type Plan = Tables<"plano"> & { item_plano: Tables<"item_plano">[] };
type Props = {
  mes: number;
  ano: number;
};

export function PlansList({ mes, ano }: Props) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

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

  const handleDelete = async () => {
    if (selectedPlanId === null) return;

    const { error } = await supabase
      .from("plano")
      .delete()
      .eq("id", selectedPlanId);
    if (error) {
      setError(error);
      return;
    }
    setPlans(plans.filter((plan) => plan.id !== selectedPlanId));
    setOpen(false);
  };

  const handleClickOpen = (id: number) => {
    setSelectedPlanId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPlanId(null);
  };

  const renderItemText = (item: Tables<"item_plano">) => {
    return `${
      diasDaSemana[item.daysOfTheWeek]
    }: ${calculateNumberOfWeekDaysInMonth(
      ano,
      mes,
      item.daysOfTheWeek
    )} x ${item.amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`;
  };

  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <Container>
      <Grid2 container spacing={2}>
        {plans.map((plan) => (
          <Grid2 size={{ xs: 12, md: 6 }} key={plan.id}>
            <Card>
              <CardContent>
                <Typography
                  variant="h5"
                  fontWeight={500}
                  color="primary"
                  gutterBottom
                >
                  {plan.name}
                </Typography>
                <Typography variant="body1" fontSize={18} color="primary">
                  <strong>{calculateTotalAmount(plan)}</strong>
                </Typography>
                <List>
                  {plan.item_plano.map((item) => (
                    <ListItem
                      disableGutters
                      key={item.id}
                      sx={{ padding: "1px 5px" }}
                    >
                      <ListItemText
                        sx={{ margin: 0 }}
                        primary={<>- {renderItemText(item)}</>}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions style={{ justifyContent: "flex-end" }}>
                <Button color="error" onClick={() => handleClickOpen(plan.id)}>
                  Apagar
                </Button>
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este plano?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error">
            Apagar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
