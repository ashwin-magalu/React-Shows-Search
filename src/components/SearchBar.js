import React from 'react'
import styled from "styled-components";
import { IoClose, IoSearch } from "react-icons/io5";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "react-click-outside-hook";
import { useEffect } from "react";
import { useRef } from "react";
import ClockLoader from "react-spinners/ClockLoader";
import { useDebounce } from "../hooks/debounceHook";
import axios from "axios";
import TvShow from "./TvShow";

const SearchBarContainer = styled(motion.div)`
  display: flex;
  margin-top: 8em;
  flex-direction: column;
  width: 34em;
  height: 3.8em;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.14);
`;

const SearchInputContainer = styled.div`
  width: 100%;
  min-height: 4em;
  display: flex;
  align-items: center;
  position: relative;
  padding: 2px 15px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  font-size: 21px;
  color: #12112e;
  font-weight: 500;
  border-radius: 6px;
  background-color: transparent;
  &:focus {
    outline: none;
    &::placeholder {
      opacity: 0;
    }
  }
  &::placeholder {
    color: #bebebe;
    transition: all 500ms ease-in-out;
  }
`;

const SearchIcon = styled.span`
  color: #bebebe;
  font-size: 27px;
  margin-right: 10px;
  margin-top: 6px;
  vertical-align: middle;
`;

const CloseIcon = styled(motion.span)`
  color: #bebebe;
  font-size: 23px;
  vertical-align: middle;
  transition: all 200ms ease-in-out;
  cursor: pointer;
  &:hover {
    color: #dfdfdf;
  }
`;

const LineSeperator = styled.span`
  display: flex;
  min-width: 100%;
  min-height: 2px;
  background-color: #d8d8d878;
  box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.3);
`;

const SearchContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1em;
  overflow-y: auto;
  background-color: whitesmoke;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WarningMessage = styled.span`
  color: #000;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-self: center;
  justify-self: center;
`;

const containerVariants = {
    expanded: {
        height: "30em",
    },
    collapsed: {
        height: "3.8em",
    },
};

const containerTransition = { type: "spring", damping: 22, stiffness: 150 };

const SearchBar = () => {
    const [isExpanded, setExpanded] = useState(false);
    const [parentRef, isClickedOutside] = useClickOutside();
    const inputRef = useRef();
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [tvShows, setTvShows] = useState([]);
    const [noTvShows, setNoTvShows] = useState(false);

    const isEmpty = !tvShows || tvShows.length === 0;

    const expandContainer = () => {
        setExpanded(true);
    };

    const collapseContainer = () => {
        setExpanded(false);
        setSearchQuery("");
        setLoading(false);
        setNoTvShows(false);
        setTvShows([]);
        if (inputRef.current) inputRef.current.value = "";
    };

    useEffect(() => {
        if (isClickedOutside) collapseContainer();
    }, [isClickedOutside]);

    const changeHandler = (e) => {
        e.preventDefault();
        if (e.target.value.trim() === "") setNoTvShows(false);

        setSearchQuery(e.target.value);
    };

    const prepareSearchQuery = (query) => {
        const url = `http://api.tvmaze.com/search/shows?q=${query}`;

        return encodeURI(url);
    };

    const searchTvShow = async () => {
        if (!searchQuery || searchQuery.trim() === "") return;

        setLoading(true);
        setNoTvShows(false);

        const URL = prepareSearchQuery(searchQuery);

        const response = await axios.get(URL).catch((err) => {
            console.log("Error: ", err);
        });

        if (response) {
            if (response.data && response.data.length === 0) setNoTvShows(true);

            setTvShows(response.data);
        }

        setLoading(false);
    };

    useDebounce(searchQuery, 500, searchTvShow);


    return (
        <SearchBarContainer
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={containerVariants}
            transition={containerTransition}
            ref={parentRef}
        >
            <SearchInputContainer>
                <SearchIcon>
                    <IoSearch />
                </SearchIcon>
                <SearchInput
                    placeholder="Search for Series/Shows"
                    onFocus={expandContainer}
                    ref={inputRef}
                    value={searchQuery}
                    onChange={changeHandler}
                />
                <AnimatePresence>
                    {isExpanded && (
                        <CloseIcon
                            key="close-icon"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={collapseContainer}
                            transition={{ duration: 0.3 }}
                        >
                            <IoClose />
                        </CloseIcon>
                    )}
                </AnimatePresence>
            </SearchInputContainer>
            {isExpanded && <LineSeperator />}
            {isExpanded && (
                <SearchContent>
                    {isLoading && (
                        <LoadingWrapper>
                            <ClockLoader loading color="green" size={50} />
                        </LoadingWrapper>
                    )}
                    {!isLoading && isEmpty && !noTvShows && (
                        <LoadingWrapper>
                            <WarningMessage>Start typing to Search</WarningMessage>
                        </LoadingWrapper>
                    )}
                    {!isLoading && noTvShows && (
                        <LoadingWrapper>
                            <WarningMessage>No Tv Shows or Series found!</WarningMessage>
                        </LoadingWrapper>
                    )}
                    {!isLoading && !isEmpty && (
                        <>
                            {tvShows.map(({ show }) => (
                                <TvShow
                                    key={show.id}
                                    thumbnailSrc={show.image && show.image.medium}
                                    name={show.name}
                                    rating={show.rating && show.rating.average}
                                    officialSite={show.officialSite}
                                />
                            ))}
                        </>
                    )}
                </SearchContent>
            )}
        </SearchBarContainer>
    )
}

export default SearchBar
