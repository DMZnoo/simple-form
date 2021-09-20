import * as React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "../Modal";

const ContactUsForm = () => {
  const [color, setColor] = React.useState<string>();
  const [showModal, toggleModal] = React.useState<boolean>();
  const schema = Yup.object().shape({
    name: Yup.string().required("A name is required"),
    emailAddress: Yup.string()
      .email("Please enter a valid email.")
      .required("An email is required"),
    password: Yup.string()
      .min(8, "Password must be longer than 8 characters.")
      .required("Required"),
    colour: Yup.string(),
    animals: Yup.object(),
  });
  const { register, handleSubmit, formState, setValue, getValues, watch } =
    useForm({
      resolver: yupResolver(schema),
    });
  const { errors } = formState;
  const colourOptions = ["Blue", "Green", "Red", "Black", "Brown"];
  const animalOptions = ["Bear", "Tiger", "Snake", "Donkey"];

  const watchTiger = watch("showTigerInput", false);

  return (
    <>
      {showModal && <Modal isOpen={showModal} closeModal={toggleModal} />}
      <div className="flex flex-col items-center space-y-5 p-4 bg-white m-2 md:w-1/2 rounded-lg">
        <h1 className="text-xl font-bold">Contact Form</h1>
        <form
          className="flex flex-col items-center w-full"
          onSubmit={handleSubmit((d) => {
            console.log(d);
            delete d["showTigerInput"];
            toggleModal(true);
          })}
        >
          <div className="flex flex-col w-full">
            <h3 className="text-md font-bold">Name</h3>
            <input
              className="mt-2 mb-4 border border-gray rounded-sm p-1"
              {...register("name")}
              placeholder="Full Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm -mt-4 mb-4">
                {errors.name.message}
              </p>
            )}
            <h3 className="text-md font-bold">Email</h3>
            <input
              className="mt-2 mb-4 border border-gray rounded-sm p-1"
              {...register("emailAddress")}
              placeholder="Email"
            />
            {errors.emailAddress && (
              <p className="text-red-500 text-sm -mt-4 mb-4">
                {errors.emailAddress.message}
              </p>
            )}
            <h3 className="text-md font-bold">Password</h3>

            <input
              className="mt-2 mb-4 border border-gray rounded-sm p-1"
              {...register("password")}
              type="password"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm -mt-4 mb-4">
                {errors.password.message}
              </p>
            )}
            <h3 className="text-md font-bold mb-2">
              What is your favorite color?
            </h3>
            <div className="grid grid-cols-2 items-center mb-4">
              {colourOptions.map((option) => {
                return (
                  <div key={option}>
                    <input
                      className="mr-2"
                      type="radio"
                      defaultChecked={color === option}
                      onClick={() => {
                        setValue("colour", option, {
                          shouldValidate: true,
                        });
                        setColor(option);
                      }}
                    />
                    <label
                      onClick={() => {
                        setValue("colour", option, {
                          shouldValidate: true,
                        });
                        setColor(option);
                      }}
                    >
                      {option}
                    </label>
                  </div>
                );
              })}
            </div>
            {errors.colour && (
              <p className="text-red-500 text-sm -mt-4 mb-4">
                {errors.colour.message}
              </p>
            )}

            <h3 className="text-md font-bold mb-2">
              What is your favorite animal?
            </h3>
            <div className="grid grid-cols-2">
              {animalOptions.map((option) => {
                return (
                  <div key={option}>
                    <input
                      className="mr-2"
                      type="checkbox"
                      {...register(
                        `${
                          option === "Tiger"
                            ? "showTigerInput"
                            : `animals.${option}`
                        }`
                      )}
                    />
                    <label>{option}</label>
                  </div>
                );
              })}
            </div>
            {watchTiger && (
              <>
                <p className="font-bold text-sm mt-4">Type of Tiger</p>
                <input
                  className="mt-2 mb-4 border border-gray rounded-sm p-1"
                  {...register("animals.Tiger", { required: "Required" })}
                  placeholder="Type of tiger"
                />
              </>
            )}

            {errors.animals && (
              <p className="text-red-500 text-sm">{errors.animals.message}</p>
            )}
            {errors.animals?.Tiger && (
              <p className="text-red-500 text-sm">
                {errors.animals.Tiger.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 rounded-lg p-2 self-end mt-8 m-4 text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default ContactUsForm;
