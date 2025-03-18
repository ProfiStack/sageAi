"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../CustomComponents/header/Header";
import Footer from "../CustomComponents/Footer/Footer";
import { useRouter } from "next/navigation";
import {
  InputAdornment,
  MenuItem,
  Select,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";
import { PhoneNumberUtil } from "google-libphonenumber";
import "react-international-phone/style.css";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

export const MuiPhone = ({ value = "", onChange = () => {}, ...restProps }) => {
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: "ae",
      value,
      countries: defaultCountries,
      // onChange
    });

  const phoneNumber = inputValue.replace(`+${country.dialCode} `, "");
  const isValid = isPhoneValid(inputValue);
  const isEdited = phoneNumber.length > 0;

  return (
    <>
      <div className="md:flex">
        <Select
          MenuProps={{
            style: {
              height: "300px",
              width: "360px",
              top: "10px",
              left: "-34px",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          }}
          className="h-[45px] my-2 md:my-0 md:w-[133px] md:h-[60px] border-[#ADB9C9] rounded-[8px] active:border-[#14A2F0] me-2 pe-5"
          value={country.iso2}
          onChange={(e) => setCountry(e.target.value)}
          renderValue={(selected) => (
            <div className="flex">
              <FlagImage iso2={selected} className="mr-[12px] md:mr-[8px]" />
              <Typography>+{country.dialCode}</Typography>
            </div>
          )}
        >
          {defaultCountries.map((c) => {
            const countryItem = parseCountry(c);
            return (
              <MenuItem key={countryItem.iso2} value={countryItem.iso2}>
                <FlagImage
                  iso2={countryItem.iso2}
                  style={{ marginRight: "8px" }}
                />
                <Typography marginRight="8px">{countryItem.name}</Typography>
                <Typography color="gray">+{countryItem.dialCode}</Typography>
              </MenuItem>
            );
          })}
        </Select>

        {/* Phone Number Input */}
        <input
          className="w-[250px] h-[45px] md:w-[450px] md:h-[60px] border-[1px] border-[#ADB9C9] rounded-[8px] px-[18px]"
          value={inputValue}
          onChange={handlePhoneValueChange}
          type="tel"
          ref={inputRef}
          placeholder="123456789"
        />
      </div>
      {!isValid && isEdited && (
        <p className="mt-2 px-[165px] text-red-500">
          Please enter a valid phone number
        </p>
      )}
    </>
  );
};

const CountrySelect = ({ value = "", onChange = () => {}, ...restProps }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
      });
  }, []);

  return (
    <FormControl>
      <Select
        value={selectedCountry}
        onChange={handleCountryChange}
        displayEmpty
        className="w-[250px] h-[45px] md:w-[285px] md:h-[60px] border-[#ADB9C9] rounded-[8px]"
        renderValue={(selected) => {
          if (selected === "") {
            return (
              <Typography style={{ color: "#ADB9C9" }}>
                Select Country
              </Typography>
            );
          }
          return countries.find((country) => country.value === selected)?.label;
        }}
      >
        <MenuItem value="" sx={{ color: "#ADB9C9" }}>
          Select Country
        </MenuItem>
        {countries.map((country) => (
          <MenuItem key={country.value} value={country.value}>
            {country.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default function Invest() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const isValidEmail = (email) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const isValidName = (name) => /^[a-zA-Z ]{2,30}$/.test(name);
  const isValidCreditCardHolder = (cardName) =>
    /^[a-zA-Z ]{2,30}$/.test(cardName);
  const isValidCardNumber = (number) => /^\d{16}$/.test(number);
  const isValidExpiry = (expiry) => /^\d{2}\/\d{2}$/.test(expiry);
  const isValidAmount = (amount) => amount >= 1000 && amount <= 1000000;
  const isValidCountry = (country) =>
    country !== "" && country !== "Select Country";
  const isValidCity = (city) => /^[a-zA-Z ]{2,30}$/.test(city);
  const isValidZipCode = (zipCode) => /^\d{5}$/.test(zipCode);
  const isValidCVV = (cvv) => /^\d{3,5}$/.test(cvv);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      router.push("/invest/success");
    }
  };

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    cardName: false,
    cardNumber: false,
    expiry: false,
    amount: false,
    country: false,
    city: false,
    zipCode: false,
    cvv: false,
  });

  const faqs = {
    faqs: [
      {
        title: "When will I be charged?",
        content:
          "Your selected payment method will be charged as soon as you click invest. However, in the case that Fantacylcing doesn't reach its funding goal of AED1M, your payment will be refunded in full.",
      },
      {
        title: "So I'm only charged if funding succeeds?",
        content:
          "For compliance reasons you will be charged as soon as you commit, but you will not invest unless Fanstacycling's fundraising campaign succeeds. If Coign does not meet its funding goal or cancels its campaign, your money will be refunded in full.",
      },
      {
        title: "What if I want to edit my investment amount?",
        content:
          "You sure can! A few kinks: you can increase your investment all the way until the campaign deadline, but if you want to cancel or decrease the investment amount, you can only do so until the cancellation deadline of November 7, 2024 per regulatory reasons.",
      },
      {
        title: "What can others see about my investment?",
        content:
          "Your investment is private by default. However, we encourage you to make it public to show your support for Fantacycling — it helps them succeed! You can edit your investment privacy setting later.",
      },
      {
        title: "Can I cancel my investment if I change my mind?",
        content:
          "You can cancel or decrease your investment any time before the official cancellation deadline set by the regulations. After that your investment will be finalized and you can no longer cancel.",
      },
      {
        title: "What information will Coign know about me?",
        content:
          "The information that is revealed to the company you invest in is limited to what is required for their records: your full name, address and your investment date and amount. Nothing else is shared unless you make it public in your privacy settings.",
      },
      {
        title: "What will I get when I invest?",
        content:
          "You get a security document — Common Stock shares, and, at the company's discretion, a bonus perk according to your investment amount.You will receive your signed investment documents if and when the campaign successfully ends and after final accounting takes place, which can take up to 60 days, and sometimes longer when the campaign has thousands of investors.",
      },
      {
        title: "Can I invest from my country?",
        content:
          "Naimaat allows anyone from anywhere to invest, but each fundraising company may choose to limit who can participate.",
      },
    ],
  };

  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&::before": {
      display: "none",
    },
  }));

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      {...props}
    />
  ))(() => ({
    backgroundColor: "transparent",
    flexDirection: "row-reverse",
    padding: 0,
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: 1,
    },
  }));
  
  const AccordionDetails = styled(MuiAccordionDetails)(() => ({
    // borderTop: "none",
  }));

  const validateForm = () => {
    const newErrors = {
      firstName: !isValidName(firstName),
      lastName: !isValidName(lastName),
      email: !isValidEmail(email),
      // phone: !isPhoneValid(phone),
      cardName: !isValidCreditCardHolder(cardName),
      cardNumber: !isValidCardNumber(cardNumber),
      expiry: !isValidExpiry(expiry),
      amount: !isValidAmount(amount),
      // country: !isValidCountry(),
      city: !isValidCity(city),
      zipCode: !isValidZipCode(zipCode),
      cvv: !isValidCVV(cvv),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((valid) => !valid);
  };
  const [expanded, setExpanded] = useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className="mx-4 md:mx-0 md:overflow-x-auto md:mx-auto md:container">
      <Header />
      <div className="md:my-12">
        <div className="flex items-center gap-[20px]">
          <Image
            src={'/images/Logo_Bici_sfondo_blu.png'}
            alt="Logo"
            width={60}
            height={60}
            className="w-[45px] md:w-[60px] md:h-[60px] rounded-[16px] md:rounded-[20px]"
          />
          <h1 className="text-[24px] md:text-[64px] font-black text-[#1D1B20]">
            {" "}
            Invest in Fantacyling
          </h1>
        </div>
        <hr className="my-4 md:my-6 opacity-40" />
        <div className="my-6 md:my-12">
          <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">
            Investment amount
          </h1>
          <p className="text-[#00000099] text-[14px] md:text-[20px] font-light">
            Payments are processed immediately.
          </p>
          <input
            className="w-[250px] h-[40px] md:w-[450px] md:h-[60px] border-[1px] border-[#ADB9C9] rounded-[8px] px-[18px] mt-[15px]"
            placeholder="min AED 1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {errors.amount && (
            <Typography color="error">Invalid amount.</Typography>
          )}
        </div>
        <hr className="md:my-6 opacity-40" />
        <form className="my-6 md:my-12" onSubmit={handleSubmit}>
          <div className="mb-4">
            <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">
              Personal Information
            </h1>
            <p className="text-[#00000099] text-[14px] md:text-[20px] font-light">
              Your information is kept strictly confidential and secure at all
              times.
            </p>
          </div>
          <div className="mb-4 flex gap-[20px]">
            <div>
              <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">
                First name
              </h1>
              <input
                type="text"
                className="w-[150px] h-[40px] md:w-[225px] md:h-[60px] border-[1px] border-[#ADB9C9] rounded-[8px] px-[18px]"
                placeholder="e.g. John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && (
                <Typography color="error">Invalid first name.</Typography>
              )}
            </div>
            <div>
              <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">
                Last name
              </h1>
              <input
                type="text"
                className="w-[150px] h-[40px] md:w-[225px] md:h-[60px] border-[1px] border-[#ADB9C9] rounded-[8px] px-[18px]"
                placeholder="e.g. Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && (
                <Typography color="error">Invalid last name.</Typography>
              )}
            </div>
          </div>
          <div className="mb-4 my-4 md:my-0 md:flex gap-[20px]">
            <div>
              <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">
                Country
              </h1>
              <CountrySelect
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              {/* {errors.country && (
                <Typography color="error">Please select a country.</Typography>
              )} */}
            </div>
            <div className="my-4 md:my-0"> 
              <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">
                City
              </h1>
              <input
                type="text"
                className="w-[150px] h-[40px] md:w-[225px] md:h-[60px]  border-[1px] border-[#ADB9C9] rounded-[8px] px-[18px]"
                placeholder="e.g. Dubai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {errors.city && (
                <Typography color="error">Invalid city.</Typography>
              )}
            </div>
            <div>
              <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">
                Zip code
              </h1>
              <input
                className="w-[150px] h-[40px] md:w-[225px] md:h-[60px]  border-[1px] border-[#ADB9C9] rounded-[8px] px-[18px]"
                placeholder="e.g. 12345"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
              {errors.zipCode && (
                <Typography color="error">Invalid zip code.</Typography>
              )}
            </div>
          </div>
          <div className="mb-4 gap-[20px]">
            <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">Email</h1>
            <input
              type="text"
              className="w-[250px] h-[45px] md:w-[450px] md:h-[60px] border-[1px] border-[#ADB9C9] rounded-[8px] px-[18px]"
              placeholder="e.g. johndoe@xyz.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <Typography color="error">Invalid email address.</Typography>
            )}
          </div>
          <div className="mb-4 gap-[20px]">
            <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">
              Phone number
            </h1>
            <MuiPhone
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {/* {errors.phone && (
              <Typography color="error">Invalid phone number.</Typography>
            )} */}
          </div>
          <hr className="md:my-6 opacity-40" />
          <div className="my-6 md:my-12 md:grid grid-cols-4">
            <div className="col-span-3 mb-4 md:mb-[200px]">
              <div className="mb-4 gap-[20px]">
                <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">
                  Payment Information
                </h1>
                <p className="text-[#00000099] text-[14px] md:text-[20px] font-light">
                  Your credit or debit card will be charged immediately.
                </p>
              </div>
              <div className="mb-4 gap-[20px]">
                <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">
                  Cardholder's name
                </h1>
                <input
                  type="text"
                  className="h-[45px] md:w-[450px] md:h-[60px] border-[1px] border-[#ADB9C9] rounded-[8px] px-[18px]"
                  placeholder="e.g. John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
                {errors.cardName && (
                  <Typography color="error">
                    Invalid cardholder name.
                  </Typography>
                )}
              </div>
              <div className="mb-4 gap-[20px]">
                <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">
                  Card number
                </h1>
                <input
                  type="text"
                  className="h-[45px] md:w-[450px] md:h-[60px] border-[1px] border-[#ADB9C9] rounded-[8px] px-[18px]"
                  placeholder="e.g. 1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                {errors.cardNumber && (
                  <Typography color="error">Invalid card number.</Typography>
                )}
              </div>
              <div className="flex gap-4">
                <div className="mb-4 gap-[20px]">
                  <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">
                    Expiry
                  </h1>
                  <input
                    type="text"
                    className="w-[120px] h-[45px] md:w-[215px] md:h-[60px] border-[1px] border-[#ADB9C9] rounded-[8px] px-[18px]"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                  {errors.expiry && (
                    <Typography color="error">Invalid expiry date.</Typography>
                  )}
                </div>
                <div className="mb-4 gap-[20px]">
                  <h1 className="text-[#1D1B20] text-[22px] md:text-[32px] font-extrabold">
                    CVV
                  </h1>
                  <input
                    type="text"
                    className="w-[120px] h-[45px] md:w-[215px] md:h-[60px] border-[1px] border-[#ADB9C9] rounded-[8px] px-[18px]"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                  {errors.cvv && (
                    <Typography color="error">Invalid CVV.</Typography>
                  )}
                </div>
              </div>

              <button
                className="w-[250px] h-[45px] md:w-[450px] md:h-[60px] bg-[#014367] rounded-[8px] text-white text-[20px] md:text-[24px] font-bold hover:bg-[#023450] transition duration-300"
                type="submit"
              >
                Confirm Investment
              </button>
            </div>
            <div className="">
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <Typography className="text-[#1D1B20] text-[32px] font-bold mx-4">
                  FAQ
                </Typography>
              </Accordion>
              {faqs.faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={handleChange(`panel${index}`)}
                >
                  <AccordionSummary
                    aria-controls={`panel${index}d-content`}
                    id={`panel${index}d-header`}
                  >
                    <Typography>{faq.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{faq.content}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
