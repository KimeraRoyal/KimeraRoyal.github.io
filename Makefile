#---------------------------------------------------------------------------------
# SOURCES: The directory containing source HTML files
# HEADER: A file to prepend to the beginning of all target HTML files
# FOODER: A file to append to the end of all target HTML files
#---------------------------------------------------------------------------------
SOURCE := src
HEADER := $(SOURCE)/header.html
FOOTER := $(SOURCE)/footer.html

#---------------------------------------------------------------------------------

LINKED_FILES := $(HEADER) $(FOOTER)
SOURCE_FILES := $(filter-out $(LINKED_FILES), $(wildcard $(SOURCE)/*.html))
TARGET_FILES := $(notdir $(SOURCE_FILES))

#---------------------------------------------------------------------------------

website : $(TARGET_FILES) $(LINKED_FILES)

%.html : $(SOURCE)/%.html $(LINKED_FILES)
	@ cat $(HEADER) > $@
	@ cat $< | sed 's/^/\t/' >> $@
	@ cat $(FOOTER) >> $@

	
