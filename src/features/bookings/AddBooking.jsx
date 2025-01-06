import toast from "react-hot-toast";
import styled from "styled-components";
import { differenceInDays } from "date-fns";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";
import Heading from "../../ui/Heading";

import { useSettings } from "../settings/useSettings";
import { useCabins } from "../cabins/useCabins";
import { useGuests } from "./useGuests";
import { useCreateBooking } from "./useCreateBooking";

import { formatCurrency } from "../../utils/helpers";

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

function AddBooking() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [optForBreakfast, setOptForBreakfast] = useState(false);
  const [cabinPrice, setCabinPrice] = useState(0);
  const [extrasPrice, setExtrasPrice] = useState(0);

  const { register, formState, handleSubmit } = useForm();
  const { errors } = formState;

  const { isLoading: settingsLoading, settings } = useSettings();
  const { isLoading: cabinsLoading, cabins } = useCabins();
  const { isLoading: guestsLoading, guests } = useGuests();
  const { createBooking, isCreating } = useCreateBooking();

  function toggleBreakfast() {
    if (optForBreakfast) setExtrasPrice(0);
    setOptForBreakfast((opt) => !opt);
  }

  function togglePaid() {
    setHasPaid((opt) => !opt);
  }
  function toggleOpen() {
    setIsOpen((opt) => !opt);
  }

  function onSubmit(data) {
    console.log("Submit ", data);

    const numNights = differenceInDays(data.endDate, data.startDate);

    if (numNights < 0) {
      toast.error(`Start date can not be before end date`);
      return;
    }

    if (numNights < settings.minBookingLength) {
      toast.error(
        `Minimum nights per booking are ${settings.minBookingLength}`
      );
      return;
    }

    if (numNights > settings.maxBookingLength) {
      toast.error(
        `Maximum nights per booking are ${settings.maxBookingLength}`
      );
      return;
    }

    if (isOpen) {
      const finalData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        numNights,
        numGuests: Number(data.numGuests),
        cabinPrice,
        extrasPrice,
        totalPrice: cabinPrice + extrasPrice,
        hasBreakfast: optForBreakfast,
        isPaid: hasPaid,
        cabinId: Number(data.cabinId),
        guestId: Number(data.guestId),
      };
      console.log(finalData);
      createBooking(finalData, {
        onSuccess: () => {
          navigate("/dashboard");
        },
      });
      return;
    }

    toggleOpen();

    const cabin = cabins
      .filter((cabin) => cabin.id === Number(data.cabinId))
      .at(0);

    setCabinPrice((cabin.regularPrice - cabin.discount) * numNights);
    if (optForBreakfast)
      setExtrasPrice(numNights * data.numGuests * settings.breakfastPrice);
  }

  if (settingsLoading || cabinsLoading || guestsLoading) return <Spinner />;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Input
          disabled={isOpen}
          type="date"
          id="startDate"
          {...register("startDate", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="End Date" error={errors?.endDate?.message}>
        <Input
          type="date"
          disabled={isOpen}
          id="endDate"
          {...register("endDate", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Number of Guests" error={errors?.numGuests?.message}>
        <Input
          disabled={isOpen}
          type="number"
          id="numGuests"
          {...register("numGuests", {
            required: "This field is required",
            max: {
              value: settings?.maxGuestsPerBooking,
              message: `Maximum Guests ${
                settings?.maxGuestsPerBooking === 1 ? "is" : "are"
              } ${settings?.maxGuestsPerBooking}`,
            },
          })}
        />
      </FormRow>

      <FormRow label="Select Cabin">
        <StyledSelect id="cabinId" disabled={isOpen} {...register("cabinId")}>
          {cabins.map((cabin) => (
            <option key={cabin.id} value={cabin.id}>
              {cabin.name}
            </option>
          ))}
        </StyledSelect>
      </FormRow>

      <FormRow label="Select Guest">
        <StyledSelect disabled={isOpen} id="guestId" {...register("guestId")}>
          {guests.map((guest) => (
            <option key={guest.id} value={guest.id}>
              {guest.fullName}
            </option>
          ))}
        </StyledSelect>
      </FormRow>

      <FormRow>
        <div>Do you want to opt for breakfast?</div>
        <Checkbox disabled={isOpen} onChange={toggleBreakfast} />
      </FormRow>

      <FormRow label="Further Observation">
        <Input
          type="text"
          defaultValue=""
          disabled={isOpen}
          {...register("observations")}
        />
      </FormRow>

      {!isOpen && (
        <FormRow>
          <Button>Calculate Price</Button>
        </FormRow>
      )}

      {isOpen && (
        <>
          <FormRow>
            <Heading as="h2">Reservation Overview</Heading>
          </FormRow>

          <FormRow label="Cabin Charges">
            <div>{formatCurrency(cabinPrice)}</div>
          </FormRow>

          {extrasPrice > 0 && (
            <>
              <FormRow label="Extra Charges">
                <div>{formatCurrency(extrasPrice)}</div>
              </FormRow>

              <FormRow label="Total Price">
                <div>{formatCurrency(extrasPrice + cabinPrice)}</div>
              </FormRow>
            </>
          )}

          <FormRow label="Select Guest">
            <StyledSelect
              id="status"
              disabled={isCreating}
              {...register("status")}
            >
              <option value="unconfirmed">Unconfirmed</option>
              <option value="checked-in">Checked-In</option>
              <option value="checked-out">Checked-Out</option>
            </StyledSelect>
          </FormRow>

          <FormRow>
            <div>Has Paid?</div>
            <Checkbox disabled={isCreating} onChange={togglePaid} />
          </FormRow>

          <FormRow>
            <Button disabled={isCreating} onClick={toggleOpen}>
              Edit Entries
            </Button>
            <Button disabled={isCreating}>Book Room</Button>
          </FormRow>
        </>
      )}
    </Form>
  );
}

export default AddBooking;
