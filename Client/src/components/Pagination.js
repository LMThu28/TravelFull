import React from 'react';
import { Button, ButtonGroup, IconButton, Text, Flex } from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Simplified: Just show Prev/Next and current page info
    // You could expand this to show page numbers if needed
    return (
        <Flex justify="center" align="center" mt={4}>
            <ButtonGroup isAttached variant="outline">
                <IconButton
                    aria-label="Previous Page"
                    icon={<ArrowLeftIcon />}
                    onClick={handlePrevious}
                    isDisabled={currentPage === 1}
                />
                <Button as="span" pointerEvents="none" px={4}>
                    Trang {currentPage} / {totalPages}
                </Button>
                <IconButton
                    aria-label="Next Page"
                    icon={<ArrowRightIcon />}
                    onClick={handleNext}
                    isDisabled={currentPage === totalPages}
                />
            </ButtonGroup>
        </Flex>
    );
};

export default Pagination;
