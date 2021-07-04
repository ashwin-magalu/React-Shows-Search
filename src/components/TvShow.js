import React from 'react'
import styled from "styled-components";

const Link = styled.a`
  width: 100%;
  min-height: 6em;
  display: flex;
  text-decoration: none;

`

const TvShowContainer = styled.div`
  width: 100%;
  min-height: 6em;
  display: flex;
  border-bottom: 2px solid #d8d8d852;
  padding: 6px 8px;
  align-items: center;
`;

const Thumbnail = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  flex: 0.4;
  img {
    width: auto;
    height: 100%;
  }
  border-radius: 5px;
  margin: auto 5px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.3);
`;

const Name = styled.h3`
  font-size: 15px;
  color: #000;
  margin-left: 10px;
  flex: 2;
  display: flex;
`;

const Rating = styled.span`
  color: red;
  font-size: 16px;
  display: flex;
  flex: 0.2;
  font-weight: bold;
`;

const TvShow = ({ thumbnailSrc, name, rating, officialSite }) => {

    return (
        <Link href={officialSite} className={`${officialSite ? "link" : "nolink"}`} target="_blank">
            <TvShowContainer>
                <Thumbnail>
                    <img src={thumbnailSrc} />
                </Thumbnail>
                <Name>{name}</Name>
                <Rating>{rating || "N/A"}</Rating>
            </TvShowContainer>
        </Link>
    )
}

export default TvShow
