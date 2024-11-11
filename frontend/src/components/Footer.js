import React from 'react';
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-custom-blue shadow mb-4 mt-[10rem] sm:mt-[20rem] text-white">
      <div className="flex w-full max-w-screen-xl mx-auto p-4 md:py-8 justify-center">
        <div className="pb-4 mr-2 sm:mr-[10rem]">
          <button onClick = {() => navigate(`/`)} className="flex items-center mb-4 cursor-pointer">
            <img src="/logo.png" className="h-10 mr-3" alt="Logo" />
            <span className="self-center text-3xl font-semibold whitespace-nowrap">CCE</span>
          </button>
          <div className = "mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="inline" width="24" height="24" data-name="Group 34025"><path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 12364"></path><g data-name="Layer 2"><path fill="white" stroke="white" stroke-width="1.5" d="M16.862 3.374A8.225 8.225 0 1 0 6.629 16.249a13.9 13.9 0 0 1 3.579 3.852l.64 1.064a.914.914 0 0 0 1.567 0l.613-1.022a11.6 11.6 0 0 1 3.28-3.654 8.218 8.218 0 0 0 .559-13.12Zm-5.227 10.011a3.657 3.657 0 1 1 3.657-3.657 3.657 3.657 0 0 1-3.657 3.657Z" data-name="Path 32506"></path></g></svg>
            <p className = "ml-2 inline">437/16 Hoang Van Thu, Ward 4, Tan Binh District, Ho Chi Minh City</p>
          </div>
          <div className = "flex mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g data-name="Group 33297"><path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 13139"></path><path fill="white" fill-rule="evenodd" d="M4.462 3.116a1.346 1.346 0 0 0-1.346 1.346 16.425 16.425 0 0 0 16.423 16.423 1.347 1.347 0 0 0 1.346-1.346v-1.777a1.345 1.345 0 0 0-.846-1.249l-2.191-.873a1.337 1.337 0 0 0-1.7.646l-.191.377a.805.805 0 0 1-.881.431l.158-.786-.158.786h-.015l-.031-.011a.5.5 0 0 1-.106-.022 6 6 0 0 1-.371-.1 13 13 0 0 1-1.251-.452 11.3 11.3 0 0 1-3.484-2.326 11.2 11.2 0 0 1-2.325-3.489 11 11 0 0 1-.453-1.25 6 6 0 0 1-.1-.377l-.025-.1-.007-.031v-.023l.792-.15-.792.15a.8.8 0 0 1 .431-.872l.381-.194a1.344 1.344 0 0 0 .648-1.7l-.876-2.2a1.35 1.35 0 0 0-1.25-.839Zm4.182 6.063a2.956 2.956 0 0 0 1.217-3.63l-.876-2.2a2.96 2.96 0 0 0-2.75-1.853H4.462A2.96 2.96 0 0 0 1.5 4.458a18.04 18.04 0 0 0 18.038 18.038 2.967 2.967 0 0 0 2.962-2.961v-1.777a2.95 2.95 0 0 0-1.862-2.746l-2.191-.884a2.97 2.97 0 0 0-3.634 1.218 12 12 0 0 1-.88-.323 9.08 9.08 0 0 1-4.96-4.965 9 9 0 0 1-.33-.879Z" data-name="Path 32779"></path></g></svg>            
            <p className = "ml-2">0918497285</p>
          </div>
          <div className = "flex mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g data-name="Group 33296"><path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 13140"></path><path fill="white" fill-rule="evenodd" d="M1.5 7.114a4.636 4.636 0 0 1 4.64-4.639h11.72a4.636 4.636 0 0 1 4.64 4.639v9.768a4.64 4.64 0 0 1-4.64 4.64H8.093a.733.733 0 0 1 0-1.465h9.767a3.177 3.177 0 0 0 3.174-3.174V7.115a3.17 3.17 0 0 0-3.174-3.174H6.14a3.17 3.17 0 0 0-3.174 3.174v4.884a.733.733 0 0 1-1.465 0Zm4.03.567a.737.737 0 0 1 1.016-.205l3.693 2.461a3.17 3.17 0 0 0 3.522 0l3.693-2.461a.733.733 0 0 1 .813 1.221l-3.693 2.462a4.66 4.66 0 0 1-5.147 0L5.734 8.697a.733.733 0 0 1-.204-1.016M1.5 14.928a.73.73 0 0 1 .733-.732h5.86a.733.733 0 0 1 0 1.466h-5.86a.736.736 0 0 1-.733-.734m0 2.931a.73.73 0 0 1 .733-.732h5.86a.733.733 0 1 1 0 1.465h-5.86a.735.735 0 0 1-.733-.733" data-name="Path 32781"></path></g></svg>
            <p className = "ml-2">info@dientoan.vn</p>
          </div>
          <a href = "https://dientoan.vn/" target="_blank" rel="noreferrer" className = "flex mb-4 hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g data-name="Group 33295"><path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 13141"></path><path fill="white" fill-rule="evenodd" d="M3.216 9.87a10 10 0 0 1 1.667-.644 18 18 0 0 1 2.707-.587 16.7 16.7 0 0 1 .968-3.819 8.7 8.7 0 0 1 .715-1.436A9.05 9.05 0 0 0 3.216 9.87M12 1.5A10.5 10.5 0 1 0 22.5 12 10.5 10.5 0 0 0 12 1.5m0 1.465a1.38 1.38 0 0 0-.989.538 5.9 5.9 0 0 0-1.094 1.856 15 15 0 0 0-.819 3.105c.922-.088 1.9-.126 2.9-.126s1.98.038 2.9.126a15 15 0 0 0-.819-3.105 5.9 5.9 0 0 0-1.094-1.856A1.38 1.38 0 0 0 12 2.965m4.41 5.675a16.7 16.7 0 0 0-.968-3.819 8.7 8.7 0 0 0-.715-1.436 9.05 9.05 0 0 1 6.056 6.485 10 10 0 0 0-1.667-.644 18 18 0 0 0-2.706-.586m-1.324 1.31a32.6 32.6 0 0 0-6.172 0q-.087.981-.088 2.051c0 .7.031 1.387.088 2.041a30.4 30.4 0 0 0 6.172 0 23.432 23.432 0 0 0 0-4.093Zm1.486 3.9q.067-.909.068-1.847c0-.634-.023-1.25-.068-1.856a19 19 0 0 1 2.124.479 6.7 6.7 0 0 1 1.88.831c.422.3.459.5.459.546s-.037.245-.459.538a6.8 6.8 0 0 1-1.88.83 17 17 0 0 1-2.124.476Zm-1.67 1.679a30.7 30.7 0 0 1-5.8 0 15 15 0 0 0 .819 3.107 5.9 5.9 0 0 0 1.094 1.855 1.167 1.167 0 0 0 1.977 0 5.9 5.9 0 0 0 1.094-1.855 15 15 0 0 0 .816-3.11Zm-.174 5.089a9.6 9.6 0 0 0 .715-1.436 16.7 16.7 0 0 0 .968-3.829 20 20 0 0 0 2.707-.576 10 10 0 0 0 1.667-.655 9.06 9.06 0 0 1-6.057 6.493Zm-5.455 0a9.06 9.06 0 0 1-6.056-6.5 10 10 0 0 0 1.667.655 20 20 0 0 0 2.707.576 16.7 16.7 0 0 0 .968 3.829 9.6 9.6 0 0 0 .713 1.437ZM7.429 13.85a17 17 0 0 1-2.124-.479 6.8 6.8 0 0 1-1.88-.83c-.422-.293-.459-.489-.459-.538s.037-.244.459-.546a6.7 6.7 0 0 1 1.88-.831 19 19 0 0 1 2.124-.479 25 25 0 0 0-.001 3.7Z" data-name="Path 32783"></path></g></svg>
            <p className = "ml-2">https://dientoan.vn/</p>
          </a>
          <a href = "https://www.facebook.com/dientoanbachkhoa" target="_blank" className = "flex mb-4 hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
              <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
            </svg>
            <p className = "ml-2">Contact us</p>
          </a>
        </div>

        <div className="pb-4">
          <div onClick = {() => navigate(`/`)} className="flex items-center mb-4 cursor-pointer ">
            <span className="self-center text-3xl font-semibold whitespace-nowrap">Links</span>
          </div>

          <a href = "https://dientoan.vn/" target="_blank" rel="noreferrer" className = "flex mb-4 hover:text-gray-200">
            <p className = "ml-2">Ho Chi Minh City University of Technology - VNU-HCM</p>
          </a>

          <a href = "https://www.facebook.com/dientoanbachkhoa" target="_blank" rel="noreferrer" className = "flex mb-4 hover:text-gray-200">
            <p className = "ml-2">Ho Chi Minh City Industry and Trade College</p>
          </a>

          <a href = "https://www.facebook.com/dientoanbachkhoa" target="_blank" rel="noreferrer" className = "flex mb-4 hover:text-gray-200">
            <p className = "ml-2">Nam Sai Gon Polytechnic College</p>
          </a>

          <a href = "https://www.facebook.com/dientoanbachkhoa" target="_blank" rel="noreferrer" className = "flex mb-4 hover:text-gray-200">
            <p className = "ml-2">Vinatex Economic - Technical College Of Ho Chi Minh City</p>
          </a>

          <a href = "https://www.facebook.com/dientoanbachkhoa" target="_blank" rel="noreferrer" className = "flex mb-4 hover:text-gray-200">
            <p className = "ml-2">Ho Chi Minh City Industry and Trade College</p>
          </a>

        </div>

      </div>
      <span className="block text-sm mb-4 text-center">
        2024 @ Copyright by Dien Toan Group
      </span>
    </footer>
  );
}

export default Footer;
