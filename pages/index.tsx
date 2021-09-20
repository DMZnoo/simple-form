import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import ContactUsForm from "../components/ContactUsForm";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className="bg-green-200 h-screen flex justify-center items-center">
      <ContactUsForm />
    </div>
  );
};

export default Home;
