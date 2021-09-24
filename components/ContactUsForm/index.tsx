import * as React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "../Modal";

//Open issue regarding types: https://github.com/jquense/yup/issues/1179
const defaultSchema = Yup.object().shape({
  name: Yup.string().required("A name is required"),
  emailAddress: Yup.string()
    .email("Please enter a valid email.")
    .required("An email is required"),
  password: Yup.string()
    .min(9, "Password must be longer than 8 characters.")
    .required("Required"),
  colour: Yup.string(),
});

const ContactUsForm = () => {
  const [color, setColor] = React.useState<string>();
  const [showModal, toggleModal] = React.useState<boolean>();
  const [schema, setSchema] = React.useState<any>(defaultSchema);
  const { register, handleSubmit, formState, setValue, watch, reset } = useForm<
    Yup.Asserts<typeof schema>
  >({
    resolver: yupResolver(schema),
    shouldUnregister: true,
  });
  const { errors, isDirty, isValid } = formState;
  const colourOptions = ["Blue", "Green", "Red", "Black", "Brown"];
  const animalOptions = ["Bear", "Snake", "Donkey"];
  const animalOptionsWithInput = {
    showTigerInput: "Tiger",
  };

  React.useEffect(() => {
    let temp = Yup.object();
    let inputTemp = Yup.object();
    animalOptions.forEach((name) => {
      temp = temp.concat(Yup.object({ [name]: Yup.boolean() }));
    });

    Object.entries(animalOptionsWithInput).forEach((entry) => {
      inputTemp = inputTemp.concat(
        Yup.object({
          [entry[0]]: Yup.boolean(),
        })
      );
      temp = temp.concat(
        Yup.object({
          [entry[1]]: Yup.string().when(entry[0], {
            is: true,
            then: Yup.string().required("Required"),
            otherwise: Yup.string(),
          }),
        })
      );
    });

    let newSchema = inputTemp.concat(
      Yup.object({
        animals: temp,
      })
    );
    newSchema = newSchema.concat(defaultSchema);
    setSchema(newSchema);
  }, []);

  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      setColor("");
      reset();
    }
  }, [formState, reset]);

  const watchValues = watch();
  return (
    <>
      {showModal && <Modal isOpen={showModal} closeModal={toggleModal} />}
      <div className="flex flex-col items-center space-y-5 p-4 bg-white m-5 md:w-1/2 rounded-lg">
        <h1 className="text-xl font-bold">Contact Form</h1>
        <form
          id="form"
          className="flex flex-col items-center w-full"
          onSubmit={handleSubmit((d) => {
            console.log(d);
            toggleModal(true);
          })}
        >
          <div className="flex flex-col w-full">
            <h2 className="text-md font-bold">Name*</h2>
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
            <h2 className="text-md font-bold">Email*</h2>
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
            <h2 className="text-md font-bold">Password*</h2>
            <input
              className="mt-2 mb-2 border border-gray rounded-sm p-1"
              {...register("password")}
              type="password"
              placeholder="Password"
            />
            <p className="mb-4">min: 8 characters</p>
            {errors.password && (
              <p className="text-red-500 text-sm -mt-4 mb-4">
                {errors.password.message}
              </p>
            )}
            <h2 className="text-md font-bold mb-2">
              What is your favorite color?
            </h2>
            <div className="grid grid-cols-2 items-center mb-4">
              {colourOptions.map((option) => {
                return (
                  <div key={option}>
                    <input
                      className="mr-2"
                      type="radio"
                      checked={color === option}
                      onChange={() => {
                        setValue("colour", option, {
                          shouldValidate: true,
                        });
                        setColor(option);
                      }}
                    />
                    <label
                      htmlFor={option}
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
                      {...register(`animals.${option}`)}
                    />
                    <label htmlFor={`animals.${option}`}>{option}</label>
                  </div>
                );
              })}
              {Object.entries(animalOptionsWithInput).map((entry) => {
                return (
                  <div key={entry[1]}>
                    <input
                      className="mr-2"
                      type="checkbox"
                      {...register(`animals.${entry[0]}`)}
                    />
                    <label htmlFor={`animals.${entry[0]}`}>{entry[1]}</label>
                  </div>
                );
              })}
            </div>
            {Object.entries(animalOptionsWithInput).map((entry) => {
              if (watchValues["animals"] && watchValues["animals"][entry[0]]) {
                return (
                  <>
                    <label
                      key={entry[1]}
                      htmlFor={entry[1]}
                      className="font-bold text-sm mt-4"
                    >
                      Type of Tiger
                    </label>
                    <input
                      className="mt-2 mb-4 border border-gray rounded-sm p-1"
                      {...register(`animals.${entry[1]}`, { required: true })}
                      placeholder="Type of tiger"
                    />
                    {errors.animals && (
                      <p className="text-red-500 text-sm">
                        {Object.keys(errors.animals).map(
                          (option) => errors.animals[option].message
                        )}
                      </p>
                    )}
                  </>
                );
              }
            })}
          </div>
          <button
            type="submit"
            className={`${
              !isDirty || !isValid
                ? "cursor-not-allowed bg-blue-200"
                : "bg-blue-500"
            } rounded-lg p-2 self-end mt-8 m-4 text-white`}
            disabled={!isDirty || !isValid}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default ContactUsForm;
